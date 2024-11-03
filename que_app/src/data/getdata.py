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

        # 題目內容：找到第二個 td
        question_text_td = item.find_all("td")[2]
        
        # 取得純題目文字（不含選項）
        question_text = question_text_td.contents[0].strip()

    
        # 先找出正確答案（在修改 DOM 之前）
        correct_option = next((opt for opt in item.select('ol li') if 'background-color: green' in str(opt)), None)
        correct_answer = correct_option.get_text(strip=True) if correct_option else None
        
        # 選項處理
        options = item.select('ol li')
        option_texts = []
        for option in options:
            # 移除 input 元素和 span 元素，只保留選項文字
            [inp.decompose() for inp in option.find_all('input')]
            [span.unwrap() for span in option.find_all('span')]
            option_texts.append(option.get_text(strip=True))
        
        # 設定選項
        question_details["Options_A"] = option_texts[0] if len(option_texts) > 0 else None
        question_details["Options_B"] = option_texts[1] if len(option_texts) > 1 else None
        question_details["Options_C"] = option_texts[2] if len(option_texts) > 2 else None
        question_details["Options_D"] = option_texts[3] if len(option_texts) > 3 else None
        
        question_details["Ans"] = correct_answer

        # 詳解
        explanation = item.find_all("td")[-1].get_text(strip=True)
        if explanation.startswith("詳解："):
            explanation = explanation[3:]  # 移除 "詳解：" 前綴
        question_details["Detailed_Answer"] = explanation

        # 組合 "題目" 和其對應的細節
        question_data["Q_Num"] = idx
        question_data["Que"] = question_text
        question_data["Detail"] = question_details

        # 添加到該章節的題目列表中
        chapter_data["questions"].append(question_data)

    # 添加到主 JSON 資料中
    output_data["chapters"].append(chapter_data)

# 儲存為 JSON 檔案
with open("combined_questions.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=4)

print("所有資料已儲存為單一 JSON 檔案")
