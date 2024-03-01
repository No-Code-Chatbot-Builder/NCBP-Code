from ctransformers import AutoModelForCausalLM

class Model:

    def load_llm(self):
        self.llm = AutoModelForCausalLM.from_pretrained("TheBloke/Mistral-7B-Instruct-v0.1-GGUF", model_file="mistral-7b-instruct-v0.1.Q4_K_M.gguf", model_type="mistral", gpu_layers=50)
        return self.llm