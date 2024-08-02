import pandas as pd
import plotly.express as px
from flask import Flask, request, jsonify

app = Flask(__name__)

def load_brand_data(brand):
    filepath = f"/home/durgeshpatel/Pictures/get_me_a_laptop/components/Python_code/{brand}.csv"  # Adjust the path as needed
    return pd.read_csv(filepath)

def load_price_data():
    price_filepath = "/home/durgeshpatel/Pictures/get_me_a_laptop/components/Python_code/Price.csv"  # Adjust the path as needed
    return pd.read_csv(price_filepath)

def get_laptop_description(brand, asin):
    brand_data = load_brand_data(brand)
    laptop_description = brand_data[brand_data['ASIN'] == asin]
    if not laptop_description.empty:
        return laptop_description.iloc[0].to_dict()
    return {}

def recommend_laptops(data, min_price, max_price, selected_options):
    weights = {
        'Battery_Value': 1,
        'Cpu_mark': 0.7,
        'Thread_mark': 0.6,
        'Memory_speed': 0.3,
    }

    # Apply price range filter
    filtered_laptops = data[(data['Price'] >= min_price) & (data['Price'] <= max_price)]

    if filtered_laptops.empty:
        return pd.DataFrame()

    columns_to_normalize = ['Battery_Value', 'Cpu_mark', 'Thread_mark', 'Memory_speed']

    # Adjust filtering and normalization based on selected options
    primary_purpose = selected_options[0]
    if primary_purpose == "Gaming":
        filtered_laptops = filtered_laptops[filtered_laptops['GPU_Model'].notna()]
        columns_to_normalize += ['G3d_mark', 'G2d_mark', 'GPU_Tdp', 'CPU_Tdp']
        weights.update({
            'G3d_mark': 1,
            'G2d_mark': 0.5,
            'GPU_Tdp': -0.5,
            'CPU_Tdp': -0.3,
        })
    elif primary_purpose == "Creative work":
        columns_to_normalize += ['Graphics_Size']
        weights.update({
            'Graphics_Size': 1,
        })

    battery_expectation = selected_options[1]
    if battery_expectation == "High":
        weights['Battery_Value'] = 1.2
    elif battery_expectation == "Exceptional":
        weights['Battery_Value'] = 1.5

    screen_size_preference = selected_options[2]
    if screen_size_preference:
        screen_size_range = {
            "12 - 14 inches": (12, 14),
            "14 - 15 inches": (14, 15),
            "15 - 16 inches": (15, 16),
        }
        if screen_size_preference in screen_size_range:
            min_size, max_size = screen_size_range[screen_size_preference]
            filtered_laptops = filtered_laptops[(filtered_laptops['Screen_Size_Inch'] >= min_size) & (filtered_laptops['Screen_Size_Inch'] <= max_size)]

    brand_preference = selected_options[3]
    if brand_preference != "No Preference" and brand_preference in filtered_laptops['Brand'].unique():
        filtered_laptops = filtered_laptops[filtered_laptops['Brand'] == brand_preference]

    weight_preference = selected_options[4]
    if weight_preference == 'Light':
        filtered_laptops = filtered_laptops[filtered_laptops['Weight_KG'] <= 1.6]

    # Check for required columns
    missing_columns = [col for col in columns_to_normalize if col not in filtered_laptops.columns]
    if missing_columns:
        raise ValueError(f"Missing columns for normalization: {missing_columns}")

    # Normalize selected columns
    for column in columns_to_normalize:
        norm_col = column + '_Norm'
        if filtered_laptops[column].max() - filtered_laptops[column].min() != 0:
            filtered_laptops[norm_col] = (filtered_laptops[column] - filtered_laptops[column].min()) / (filtered_laptops[column].max() - filtered_laptops[column].min())
        else:
            filtered_laptops[norm_col] = 0

    # Weight and composite score calculation
    for column in columns_to_normalize:
        filtered_laptops[column + '_Weighted'] = filtered_laptops[column + '_Norm'] * weights.get(column, 0)

    filtered_laptops['Composite_Score'] = filtered_laptops[[col + '_Weighted' for col in columns_to_normalize]].sum(axis=1)

    recommended_laptops = filtered_laptops.nlargest(5, 'Composite_Score')

    return recommended_laptops, columns_to_normalize

def generate_graph(filtered_laptops, laptop, columns_to_normalize):
    # Calculate the average normalized values for the filtered laptops
    average_normalized_values = filtered_laptops[[col + '_Norm' for col in columns_to_normalize]].mean().reset_index()
    average_normalized_values.columns = ['Metric', 'Normalized Value']
    
    # Get the normalized values for the selected laptop
    laptop_normalized_values = laptop[[col + '_Norm' for col in columns_to_normalize]].reset_index()
    laptop_normalized_values.columns = ['Metric', 'Normalized Value']

    # Remove the '_Norm' suffix to keep metric names consistent
    average_normalized_values['Metric'] = average_normalized_values['Metric'].str.replace('_Norm', '')
    laptop_normalized_values['Metric'] = laptop_normalized_values['Metric'].str.replace('_Norm', '')

    # Calculate the original values for display in hover data
    average_normalized_values['Original Value'] = filtered_laptops[columns_to_normalize].mean().values
    laptop_normalized_values['Original Value'] = laptop[columns_to_normalize].values

    # Assign categories for the comparison
    average_values_melted = average_normalized_values.assign(Category='Average Laptop')
    laptop_values_melted = laptop_normalized_values.assign(Category='This Laptop')
    
    # Concatenate the data for the comparison plot
    comparison_df = pd.concat([average_values_melted, laptop_values_melted])

    # Generate the comparison bar graph using Plotly Express
    fig = px.bar(comparison_df, x='Metric', y='Normalized Value', color='Category', 
                 color_discrete_sequence=['#65408e', '#fbc137'], barmode='group', 
                 hover_data={'Original Value': True}, template="plotly")
    
    # Update the layout for better visualization
    fig.update_layout(height=300, 
                      xaxis_title='Metrics', yaxis_title='Normalized Value')
    
    return fig.to_json()

def generate_price_graph(asin):
    price_data = load_price_data()
    if asin not in price_data['ASIN'].values:
        return {}
    
    laptop_price_data = price_data[price_data['ASIN'] == asin]
    price_data_melted = laptop_price_data.melt(id_vars=['ASIN'], var_name='Date', value_name='Price')

    fig = px.line(price_data_melted, x='Date', y='Price',
                  labels={'Date': 'Date', 'Price': 'Price'},
                  markers=True)
    
    fig.update_layout(height=300, xaxis_title='Date', yaxis_title='Price')
    return fig.to_json()

@app.route('/recommend', methods=['POST'])
def recommend():
    data = pd.read_csv('/home/durgeshpatel/Pictures/get_me_a_laptop/components/Python_code/Comparison_Final.csv')
    request_data = request.json
    min_price = request_data['minPrice']
    max_price = request_data['maxPrice']
    selected_options = request_data['selectedOptions']

    recommended_laptops, columns_to_normalize = recommend_laptops(data, min_price, max_price, selected_options)

    if recommended_laptops.empty:
        return jsonify({'message': 'No laptops found in the specified price range.'})

    results = []
    for index, laptop in recommended_laptops.iterrows():
        laptop = laptop.dropna()  # Remove NaN values from the Series
        laptop_data = laptop.to_dict()
        brand = laptop_data['Brand']
        asin = laptop_data['ASIN']
        description = get_laptop_description(brand, asin)
        laptop_data.update(description)
        laptop_data = {k: v for k, v in laptop_data.items() if pd.notna(v)}  # Remove any NaN values in the dictionary
        graph_data = generate_graph(recommended_laptops, laptop, columns_to_normalize)
        price_graph_data = generate_price_graph(asin)
        laptop_data['graph'] = graph_data
        laptop_data['price_graph'] = price_graph_data
        results.append(laptop_data)
   
    if not results:
        return jsonify({'message': 'No valid laptops found after filtering out NaN values.'})

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
