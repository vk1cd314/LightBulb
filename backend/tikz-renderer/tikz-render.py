import os
import subprocess
import re

def compile_tikz_to_jpg(tikz_code, output_file):
    latex_content = (
        "\\documentclass{standalone}\n"
        "\\usepackage{tikz}\n"
        "\\usetikzlibrary{calc}\n"
        "\\begin{document}\n"
        + tikz_code +
        "\\end{document}"
    )
    
    temp_dir = "./temp_latex/"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    temp_tex_file = os.path.join(temp_dir, "temp_tikz.tex")
    with open(temp_tex_file, "w") as f:
        f.write(latex_content)
    
    pdflatex_command = ["pdflatex", "-interaction=nonstopmode", temp_tex_file]
    try:
        subprocess.check_call(pdflatex_command)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred during pdflatex compilation: {e}")
        return
    
    pdf_file = "temp_tikz.pdf"
    convert_command = ["convert", "-density", "300", pdf_file, output_file]
    try:
        subprocess.check_call(convert_command)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred during conversion to JPG: {e}")
        return
    
    cleanup_files = [pdf_file, temp_tex_file, "temp_tikz.aux", "temp_tikz.log"]
    for file in cleanup_files:
        try:
            os.remove(file)
        except FileNotFoundError:
            pass
    
    try:
        os.rmdir("temp_latex")
    except Exception as e:
        print(e)

def extract_tikz_from_tex(tex_file):
    try:
        with open(tex_file, 'r') as f:
            tikz_code = f.read().strip()
    except FileNotFoundError:
        print(f"Error: File '{tex_file}' not found.")
        return
    except IOError:
        print(f"Error: Could not read file '{tex_file}'.")
        return
    return tikz_code

if __name__ == "__main__":
    tikz_code = extract_tikz_from_tex("example.tex")
    
    output_file = "output.jpg"  
    
    compile_tikz_to_jpg(tikz_code, output_file)
