# Code you provided, intended for Addtodo.py
import google.generativeai as genai
import os
key = os.getenv('gemini_api')
genai.configure(api_key=key)

model_name = "gemini-1.5-flash-002"

def response(prompt):
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.2,
                "max_output_tokens": 1000,
                "top_p": 0.8,
                "top_k": 40,
            }
        )
        return response.text

def enhance_description(text):
    prompt = f"Enhance the following task description: {text}"
    return response(prompt)

def generate_createtask_description(task_name):
    prompt = f"Generate a detailed task description for: '{task_name}'"
    return response(prompt)
