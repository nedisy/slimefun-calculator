import json
import os
import re

# Used to convert items.json (from https://github.com/TheSilentPro/SlimefunScrapper/blob/master/items.json) to recipes.json 

color_pattern = re.compile(r'Â§[0-9a-z]')
def clean_name(input_text):
    return color_pattern.sub('', input_text).lower()


def reformat_item(item):
    item_name = clean_name(item['name'])
    formatted_item = {
        item_name: {
            "obtained": item['recipe']['output']['amount'],
            "obtaining": item['recipe_type']['key'].split(":")[1],
            "require": {}
        }
    }
    
    for ingredient in item['recipe']['ingredients']:
        if ingredient and ingredient['type']:
            ingredient_name = ''
            if 'meta' not in ingredient: ingredient_name = ingredient['type'].lower()
            elif 'display_name' not in ingredient['meta']: ingredient_name = ingredient['type'].lower()
            else: ingredient_name = clean_name(ingredient['meta']['display_name'])
            if ingredient_name not in formatted_item[item_name]["require"]: formatted_item[item_name]["require"][ingredient_name] = 0
            formatted_item[item_name]["require"][ingredient_name] += ingredient.get('amount', 1)
    
    return formatted_item

def main():
    # Get the directory of the script
    script_directory = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the absolute path to the input file
    input_file_path = os.path.join(script_directory, "items_2024_01_22.json")
    
    try:
        # Attempt to read the file
        with open(input_file_path, 'r') as file:
            input_data = json.load(file)
    except FileNotFoundError:
        # Print the files in the script's directory for debugging
        print("Files in the script's directory:", os.listdir(script_directory))
        raise  # Re-raise the FileNotFoundError to show the error message

    formatted_items = {}

    for item in input_data:
        # print(item['id']+' '+ clean_name(item['name']))
        item_name = clean_name(item['name'])
        if 'dust' in item_name: continue
        formatted_items.update(reformat_item(item))

    output_data = json.dumps(formatted_items, indent=4)
    
    # Construct the absolute path to the output file
    output_file_path = os.path.join(script_directory, "recipes.json")
    
    with open(output_file_path, 'w') as output_file:
        output_file.write(output_data)

if __name__ == "__main__":
    main()