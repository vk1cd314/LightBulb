import os
import subprocess
import base64

def compile_tikz_to_jpg(tikz_code, output_file):
    latex_content = (
        "\\documentclass{standalone}\n"
        "\\usepackage{tikz}\n"
        "\\usepackage{tikz-qtree,tikz-qtree-compat}\n"
        "\\usepackage{tikz,tikz-3dplot,tikz-cd,tkz-tab,tkz-euclide,pgf,pgfplots}\n"
        "\\pgfplotsset{compat=newest}\n"
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
        # return False
    
    pdf_file = "temp_tikz.pdf"
    convert_command = ["magick", "-density", "300", pdf_file, output_file]
    try:
        subprocess.check_call(convert_command)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred during conversion to JPG: {e}")
        # return False
    
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

    return True

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string

def decode_base64_to_image(base64_string, output_file):
    with open(output_file, "wb") as image_file:
        image_file.write(base64.b64decode(base64_string))
