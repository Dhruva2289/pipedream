import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The purpose of the file. Use 'fine-tune' for fine-tuning and 'assistants' for assistants and messages.",
      options: [
        "fine-tune",
        "assistants",
      ],
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for the request.",
      options: [
        "tts-1",
        "tts-1-hd",
        "gpt-3.5-turbo-1006",
        "babbage-002",
        "davinci-002",
        "gpt-4-0613",
      ],
    },
    input: {
      type: "string",
      label: "Input",
      description: "The text to generate audio for. The maximum length is 4096 characters.",
      maxLength: 4096,
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice to use when generating the audio. Supported voices are alloy, echo, fable, onyx, nova, and shimmer.",
      options: [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The format to return the audio in. Supported formats are mp3, opus, aac, and flac.",
      options: [
        "mp3",
        "opus",
        "aac",
        "flac",
      ],
      optional: true,
    },
    speed: {
      type: "number",
      label: "Speed",
      description: "The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default.",
      min: 0.25,
      max: 4.0,
      default: 1.0,
      optional: true,
    },
    trainingFile: {
      type: "string",
      label: "Training File",
      description: "Provide a reference to a file on `/tmp` that you wrote in a previous step.",
    },
    file: {
      type: "string",
      label: "File",
      description: "Provide a reference to a file on `/tmp` that you wrote in a previous step.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.openai.com/v1";
    },
    async _makeRequest({
      $ = this, method = "GET", path, headers, params, data, ...otherOpts
    } = {}) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        params,
        data,
        ...otherOpts,
      });
    },
    async listFineTuningJobs(opts = {}) {
      const {
        after, ...otherOpts
      } = opts;
      return this._makeRequest({
        path: "/fine_tuning/jobs",
        params: {
          after,
          ...otherOpts,
        },
      });
    },
    async listFiles(opts = {}) {
      return this._makeRequest({
        path: "/files",
        ...opts,
      });
    },
  },
};
