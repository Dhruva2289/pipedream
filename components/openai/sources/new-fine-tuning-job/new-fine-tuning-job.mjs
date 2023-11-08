import openai from "../../openai.app.mjs";

export default {
  key: "openai-new-fine-tuning-job",
  name: "New Fine Tuning Job",
  description: "Emits an event for each new fine-tuning job completed after the last processed job. [See the documentation](https://docs.openai.com/api-reference/fine-tunes/list/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    openai,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch the last 10 fine-tuning jobs during the first run
      const { data } = await this.openai.listFineTuningJobs({
        limit: 10,
      });
      const lastJobs = data.reverse();
      lastJobs.slice(0, 10).forEach((job) => {
        this.$emit(job, {
          id: job.id,
          summary: `Fine-tuning job ${job.id} completed`,
          ts: job.created_at * 1000,
        });
      });

      // Save the after string from the last job in the db to use in future runs
      const lastJob = lastJobs[0];
      this.db.set("after", lastJob.id);
    },
  },
  async run() {
    // Retrieve the after string from the db to fetch only new jobs
    const after = this.db.get("after");

    // Fetch new fine-tuning jobs since the last processed job
    const { data } = await this.openai.listFineTuningJobs({
      after,
    });
    const newJobs = data;
    if (newJobs.length > 0) {
      // Emit an event for each new fine-tuning job
      newJobs.forEach((job) => {
        this.$emit(job, {
          id: job.id,
          summary: `Fine-tuning job ${job.id} completed`,
          ts: job.created_at * 1000,
        });
      });

      // Update the after string in the db with the id of the last job processed
      const lastJob = newJobs[newJobs.length - 1];
      this.db.set("after", lastJob.id);
    }
  },
};
