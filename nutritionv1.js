function getNutritionInfo() {
    var userInput = document.getElementById('outputArea').value;
    var nutritionResultsContainer = document.getElementById('nutritionResults');

    // Clear previous nutrition information
    document.getElementById('nutritionResults').innerHTML = '';

    var apiKey = 'tF7BbRkGR2b92Vuhegw4uFk8XkIK0NjSxFhoGEoF';
    var apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${userInput}&api_key=${apiKey}`;

    // Make a request to the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process and display the nutrition information
            if (data.foods && data.foods.length > 0) {
                const foodItem = data.foods[0];
                
                nutritionResultsContainer.innerHTML += `<p>${foodItem.description}</p>`;
                
                // Display serving size details for all portions
                if (foodItem.foodPortions && foodItem.foodPortions.length > 0) {
                    foodItem.foodPortions.forEach((portion, index) => {
                        nutritionResultsContainer.innerHTML += `<p>Serving Size ${index + 1}: ${portion.gramWeight}g</p>`;
                    });
                }

                // Display basic nutrition information
                nutritionResultsContainer.innerHTML += `<p>Protein: ${foodItem.foodNutrients.find(nutrient => nutrient.nutrientName === 'Protein').value}g</p>`;
                nutritionResultsContainer.innerHTML += `<p>Fat: ${foodItem.foodNutrients.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)').value}g</p>`;
                nutritionResultsContainer.innerHTML += `<p>Carbohydrates: ${foodItem.foodNutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference').value}g</p>`;
                
                // Display calories information
                const caloriesInfo = foodItem.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy');
                if (caloriesInfo) {
                    nutritionResultsContainer.innerHTML += `<p>Calories: ${caloriesInfo.value}</p>`;
                } else {
                    nutritionResultsContainer.innerHTML += `<p>Calories information not found.</p>`;
                }
            } else {
                nutritionResultsContainer.textContent = 'No nutrition information found.';
            }
        })
        .catch(error => {
            console.error('Error fetching nutrition information:', error);
        });
}