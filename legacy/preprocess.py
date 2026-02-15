import csv
import json
from collections import defaultdict
import os

def extract_info_from_filenames(directory):
    """
    Extract company names and durations from CSV filenames in the specified directory.

    Parameters:
    directory (str): The directory containing the CSV files.

    Returns:
    dict: A dictionary where the keys are company names and the values are lists of durations.
    """
    files = os.listdir(directory)
    companies = {}

    for filename in files:
        if filename.endswith(".csv"):
            parts = filename.split('_')
            company_name = parts[0]
            duration = '_'.join(parts[1:]).replace('.csv', '')

            if company_name not in companies:
                companies[company_name] = []
            companies[company_name].append(duration)

    return companies

def process_company_data(directory, company_info):
    """
    Process CSV files and collect question data with frequency for each company and duration.

    Parameters:
    directory (str): Directory where the CSV files are stored.
    company_info (dict): Dictionary containing company names and their respective durations.

    Returns:
    dict: A dictionary containing question IDs, titles, difficulty, leetcodeUrl, and frequency per company and duration.
    """
    question_data = defaultdict(lambda: {'title': None, 'difficulty': None, 'leetcodeUrl': None, 'companies': defaultdict(dict)})

    for company, durations in company_info.items():
        for duration in durations:
            csv_file = os.path.join(directory, f'{company}_{duration}.csv')
            
            with open(csv_file, 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    question_id = row['ID']
                    
                    if not question_data[question_id]['title']:
                        question_data[question_id]['title'] = row['Title']
                    if not question_data[question_id]['difficulty']:
                        question_data[question_id]['difficulty'] = row['Difficulty']
                    if not question_data[question_id]['leetcodeUrl'] and 'Leetcode Question Link' in row:
                        question_data[question_id]['leetcodeUrl'] = row['Leetcode Question Link']
                    
                    question_data[question_id]['companies'][company][duration] = row['Frequency']

    return question_data

def save_json(data, filepath):
    """
    Save a dictionary as a JSON file.

    Parameters:
    data (dict): The data to save.
    filepath (str): The path where the JSON file will be saved.
    """
    with open(filepath, 'w') as json_file:
        json.dump(data, json_file, indent=4)

# Define the directory where CSV files are stored and the output path
data_directory = 'public/data/LeetCode-Questions-CompanyWise'
output_filepath = 'public/leetcode_data.json'

# Step 1: Extract company info from filenames
company_info = extract_info_from_filenames(data_directory)

# Step 2: Process CSV files and gather question data
question_data = process_company_data(data_directory, company_info)

# Step 3: Sort question data by question ID
sorted_question_data = dict(sorted(question_data.items(), key=lambda item: int(item[0])))

# Step 4: Combine into a single data structure
combined_data = {
    "companies": company_info,
    "questions": sorted_question_data
}

# Step 5: Save the combined data to a single JSON file
save_json(combined_data, output_filepath)

print(f"Preprocessing complete! Data saved to {output_filepath}")
