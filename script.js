let alltrees = [];
const cart = [];

const loadButton = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then(res => res.json())
        .then((btn) => displayButton(btn.categories));
};

const displayButton = (buttons) => {
    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML = "";

    const allBtn = document.createElement("div");
    allBtn.innerHTML = `
        <button onclick="loadPlants(0)"
            class="border-none p-3 w-full rounded-lg text-left hover:bg-green-400 max-w-[250px]">
            All Trees</button>`;
    levelContainer.append(allBtn);

    for (let button of buttons) {

        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
     <button onclick="loadPlantsByCategory('${button.category_name}')" class="border-none p-3 w-full rounded-lg text-left hover:bg-green-400 max-w-[250px] focus:bg-green-600">
                ${button.category_name}
            </button>
    `;

        levelContainer.append(btnDiv)

    }
};
loadButton();


const loadPlants = (limit = 6) => {
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(resp => resp.json())
        .then((plant) => {
            alltrees = plant.plants;
            const allTreeCard = limit ? alltrees.slice(0, limit) : alltrees;
            displayPlants(allTreeCard)
        });
};

const loadPlantsByCategory = (categoryName) => {
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(respn => respn.json())
        .then((plant) => {
            alltrees = plant.plants;
            const specificTree = alltrees.filter(tree => tree.category === categoryName);
            displayPlants(specificTree);
        })

}

const displayPlants = (trees) => {
    const plantContainer = document.getElementById('plant-container')
    plantContainer.innerHTML = "";

    for (let tree of trees) {
        const plantDiv = document.createElement('div')
        plantDiv.innerHTML = `
        <div class="border rounded-lg bg-white py-3 px-2 shadow">
            <img class="rounded-lg w-full h-[186px] object-cover mx-auto" src="${tree.image}" alt="${tree.name}">
            <p class="text-[16px] font-bold p-2 pb-0">${tree.name}</p>
            <p class="p-2 text-sm">${tree.description.slice(0, 60)}...</p>
            <div class="flex justify-between items-center my-2 mx-2">
                <p class="bg-green-200 rounded-3xl p-2 text-sm">${tree.category}</p>
                <strong><i class="fa-solid fa-bangladeshi-taka-sign"></i>${tree.price || 0}</strong>
            </div>
            <button class="add-to-cart border-none p-3 w-full rounded-3xl bg-green-600 text-white"
                tree-name="${tree.name}" 
                tree-price="${tree.price}">
                Add to Cart
            </button>
        </div>
        `;
        plantContainer.append(plantDiv)
    };

    addToCartButton();

};
const addToCartButton = () => {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('tree-name');
            const price = parseFloat(button.getAttribute('tree-price')) || 0;

            addToCart(name, price)
        });
    });

};
const addToCart = (name, price) => {
    const cartItem = cart.find(item => item.name === name);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    };

    cartInfo();
};

const cartInfo = () => {
    const historyBox = document.querySelector('.history-box');
    historyBox.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <div class="flex justify-between items-center px-4 py-2 border-b">
            <div>
                <p class="font-medium">${item.name}</p>
                <p class="text-sm"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${item.price} <i class="fa-solid fa-xmark"></i> ${item.quantity}</p>
            </div>
            <button class="text-red-600 font-bold text-lg" onclick="removeFromCart(${index})">
            <i class="fa-regular fa-circle-xmark">
            </i></button>
            </div>
        `;

        total += item.price * item.quantity;
        historyBox.appendChild(cartItem);
    });

    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<div class="px-4 py-2 font-semibold text-right">
    Total: <i class="fa-solid fa-bangladeshi-taka-sign"></i>${total}
    </div>`;
    historyBox.appendChild(totalDiv);


};
const removeFromCart = (index) => {
    cart.splice(index, 1);
    cartInfo();
};

loadButton()
loadPlants();

