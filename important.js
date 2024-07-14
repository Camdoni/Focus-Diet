// Function to make OpenAI request
async function fetchOpenAIResponse(altFood) {
    // Your OpenAI API key (replace with your actual key)
    const apiKey = "sk-proj-GXBqEE3NUmj80IXY4GgPT3BlbkFJFimv73djLwjq9mf9SsKX";

    // Make OpenAI request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `Healthy, edible, realistic, delicious, specific alternative to ${altFood} in one or two words.` }
            ],
        }),
    });

    // Parse the OpenAI response
    const data = await response.json();

    // Extract the relevant information from the response
    const aiOutput = data.choices[0].message.content;

    // Display the AI output on the screen
    document.getElementById("outputArea").innerHTML = `<p>Original Option: ${altFood}</p><p>Alternate Option: ${aiOutput}</p>`;

    // Get and display nutrition information for AI response
    getNutritionInfo(aiOutput, 'aiNutritionResults');
}

// Function to get user input and trigger OpenAI request
function getOpenAIResponse(event) {
    // Prevent the form from submitting in the traditional way
    event.preventDefault();

    // Get the value from the input field
    var altFood = document.getElementById("altFoodInput").value;

    // Make OpenAI request
    fetchOpenAIResponse(altFood);

    // Get and display nutrition information for user input
    getNutritionInfo(altFood, 'userNutritionResults');
}

// Function to get nutrition information
function getNutritionInfo(userInput, resultContainerId) {
    var nutritionResultsContainer = document.getElementById(resultContainerId);

    // Clear previous nutrition information
    nutritionResultsContainer.innerHTML = '';

    var apiKey = 'BK68RQowrQL4jqjD3AwD0uxgl4DXfXhsGig7EdCN';
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

