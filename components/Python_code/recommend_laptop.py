import sys
import json
import pandas as pd

def recommend_laptop(data, min_price, max_price, selected_options):
    # Process selected_options as needed
    print(f"Selected options: {selected_options}")

    filtered_laptops = data[(data['Price'] >= min_price) & (data['Price'] <= max_price)]

    if (filtered_laptops.empty):
        return {"message": "No laptops found in the specified price range."}

    columns_to_normalize = ['Battery_Value', 'Cpu_mark', 'Cores', 'Thread_mark', 'Tdp_1', 'G3d_mark', 'G2d_mark']
    weights = {
        'Battery_Value': 0.5,
        'Cpu_mark': 0,
        'Cores': 0,
        'Thread_mark': 0,
        'Tdp_1': 0.0,
        'G3d_mark': 0,
        'G2d_mark': 0.0,
        'Weight_value': 2
    }

    for column in columns_to_normalize:
        filtered_laptops[column + '_Norm'] = (filtered_laptops[column] - filtered_laptops[column].min()) / (filtered_laptops[column].max() - filtered_laptops[column].min())

    for column in columns_to_normalize:
        filtered_laptops[column + '_Weighted'] = filtered_laptops[column + '_Norm'] * weights[column]

    filtered_laptops['Composite_Score'] = filtered_laptops[[col + '_Weighted' for col in columns_to_normalize]].sum(axis=1)

    best_laptop = filtered_laptops.loc[filtered_laptops['Composite_Score'].idxmax()]

    return best_laptop[['a', 'b', 'Price', 'Audio', 'Battery', 'Camera', 'Color', 'Dimensions (W x D x H)', 'Display', 'Expansion Slots (includes used)', 'I/O Ports', 'Included in the Box', 'Keyboard & Touchpad', 'Memory', 'Microsoft Office', 'Military Grade', 'Network and Communication', 'Operating System', 'Power Supply', 'Security', 'Storage', 'Weight', 'Neural Processor', 'Graphics', 'Processor', 'Xbox Game Pass']].to_dict()

if __name__ == "__main__":
    min_price = float(sys.argv[1])
    max_price = float(sys.argv[2])
    selected_options = json.loads(sys.argv[3].replace("'", '"'))

    data = pd.read_csv('/home/durgeshpatel/Pictures/get_me_a_laptop/components/Python_code/output.csv')
    result = recommend_laptop(data, min_price, max_price, selected_options)
    print(json.dumps(result))
