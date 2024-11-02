from bs4 import BeautifulSoup
import json
import os

# 設定HTML檔案的資料夾路徑
html_folder = "./html"
output_data = {"chapters": []}

# 處理每個HTML檔案
for i in range(1, 7):  # ch01到ch06
    file_path = os.path.join(html_folder, f"ch0{i}.html")
    
    with open(file_path, "r", encoding="utf-8") as file:
        html_content = file.read()
    
    # 解析HTML檔案
    soup = BeautifulSoup(html_content, 'html.parser')
    chapter_data = {
        "chap": f"ch0{i}",
        "questions": []
    }
    
    # 擷取題目與選項
    question_items = soup.select('.item')
    for idx, item in enumerate(question_items, 1):
        question_data = {}
        question_details = {}

        # 題目內容
        question_text = item.find_all("td")[2].get_text(strip=True)

        # 選項
        options = item.select('ol li')
        question_details["Options_A"] = options[0].get_text(strip=True) if options else None
        question_details["Options_B"] = options[1].get_text(strip=True) if options else None
        question_details["Options_C"] = options[2].get_text(strip=True) if options else None
        question_details["Options_D"] = options[3].get_text(strip=True) if options else None

        # 正確答案：找出帶有綠色背景的選項
        correct_option = next((opt for opt in options if 'background-color: green' in str(opt)), None)
        question_details["Ans"] = correct_option.get_text(strip=True) if correct_option else None

        # 詳解
        explanation = item.find_all("td")[-1].get_text(strip=True)
        question_details["Detailed_Answer"] = explanation

        # 組合 "題目" 和其對應的細節
        question_data[f"Q_Num"] = idx
        question_data["Que"] = question_text
        question_data["Detail"] = question_details
        
        # 添加到該章節的題目列表中
        chapter_data["questions"].append(question_data)

    # 添加到主JSON資料中
    output_data["chapters"].append(chapter_data)

# 儲存為 JSON 檔案
with open("combined_questions.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=4)

print("所有資料已儲存為單一 JSON 檔案")
