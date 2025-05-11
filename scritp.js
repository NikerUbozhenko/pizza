document.addEventListener('DOMContentLoaded', function() {
    // Цены ингредиентов
    const prices = {
        'Тонкое тесто': 150,
        'Традиционное тесто': 180,
        'Сырные бортики': 220,
        'Томатный': 50,
        'Сливочный': 60,
        'Острый': 70,
        'Барбекю': 80,
        'Пепперони': 90,
        'Ветчина': 80,
        'Курица': 85,
        'Бекон': 100,
        'Шампиньоны': 60,
        'Маслины': 70,
        'Томаты': 50,
        'Ананасы': 65,
        'Лук': 40,
        'Перец': 55
    };
    
    // Цвета для визуализации ингредиентов
    const ingredientColors = {
        'Тонкое тесто': '#f0b37e',
        'Традиционное тесто': '#e67e22',
        'Сырные бортики': '#f1c40f',
        'Томатный': '#e74c3c',
        'Сливочный': '#f5d7b0',
        'Острый': '#d35400',
        'Барбекю': '#8b4513',
        'Пепперони': '#c0392b',
        'Ветчина': '#e6b0aa',
        'Курица': '#f5b041',
        'Бекон': '#a04000',
        'Шампиньоны': '#d5dbdb',
        'Маслины': '#34495e',
        'Томаты': '#e74c3c',
        'Ананасы': '#f4d03f',
        'Лук': '#7dcea0',
        'Перец': '#27ae60'
    };
    
    // Текущий заказ
    const order = {
        base: null,
        sauce: null,
        ingredient1: [],
        ingredient2: []
    };
    
    // Элементы DOM
    const baseList = document.getElementById('base-list');
    const sauceList = document.getElementById('sauce-list');
    const ingredient1List = document.getElementById('ingredient1-list');
    const ingredient2List = document.getElementById('ingredient2-list');
    const selectedItemsContainer = document.getElementById('selected-items');
    const totalPriceElement = document.getElementById('total-price');
    const orderBtn = document.getElementById('order-btn');
    
    // Части пиццы для визуализации
    const basePart = document.getElementById('base-part');
    const saucePart = document.getElementById('sauce-part');
    const ingredient1Part = document.getElementById('ingredient1-part');
    const ingredient2Part = document.getElementById('ingredient2-part');
    
    // Обработчики событий для выбора ингредиентов
    baseList.addEventListener('click', function(e) {
        if (e.target.classList.contains('ingredient-item')) {
            // Удаляем выделение у всех элементов основы
            document.querySelectorAll('#base-list .ingredient-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Добавляем выделение выбранному элементу
            e.target.classList.add('selected');
            
            // Обновляем заказ
            const ingredientName = e.target.dataset.name;
            order.base = ingredientName;
            
            // Обновляем визуализацию
            basePart.style.backgroundColor = ingredientColors[ingredientName];
            basePart.classList.add('visible');
            
            // Обновляем сводку заказа
            updateOrderSummary();
            checkOrderComplete();
        }
    });
    
    sauceList.addEventListener('click', function(e) {
        if (e.target.classList.contains('ingredient-item')) {
            // Удаляем выделение у всех элементов соуса
            document.querySelectorAll('#sauce-list .ingredient-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Добавляем выделение выбранному элементу
            e.target.classList.add('selected');
            
            // Обновляем заказ
            const ingredientName = e.target.dataset.name;
            order.sauce = ingredientName;
            
            // Обновляем визуализацию
            saucePart.style.backgroundColor = ingredientColors[ingredientName];
            saucePart.classList.add('visible');
            
            // Обновляем сводку заказа
            updateOrderSummary();
            checkOrderComplete();
        }
    });
    
    ingredient1List.addEventListener('click', function(e) {
        if (e.target.classList.contains('ingredient-item')) {
            const ingredientName = e.target.dataset.name;
            
            // Если ингредиент уже выбран, удаляем его
            if (e.target.classList.contains('selected')) {
                e.target.classList.remove('selected');
                order.ingredient1 = order.ingredient1.filter(item => item !== ingredientName);
            } else {
                // Иначе добавляем (но не более одного)
                document.querySelectorAll('#ingredient1-list .ingredient-item').forEach(item => {
                    if (item.dataset.name === ingredientName) {
                        item.classList.add('selected');
                    } else {
                        item.classList.remove('selected');
                    }
                });
                
                order.ingredient1 = [ingredientName];
            }
            
            // Обновляем визуализацию
            updatePizzaVisualization();
            
            // Обновляем сводку заказа
            updateOrderSummary();
            checkOrderComplete();
        }
    });
    
    ingredient2List.addEventListener('click', function(e) {
        if (e.target.classList.contains('ingredient-item')) {
            const ingredientName = e.target.dataset.name;
            
            // Если ингредиент уже выбран, удаляем его
            if (e.target.classList.contains('selected')) {
                e.target.classList.remove('selected');
                order.ingredient2 = order.ingredient2.filter(item => item !== ingredientName);
            } else {
                // Иначе добавляем (можно несколько)
                e.target.classList.add('selected');
                order.ingredient2.push(ingredientName);
            }
            
            // Обновляем визуализацию
            updatePizzaVisualization();
            
            // Обновляем сводку заказа
            updateOrderSummary();
            checkOrderComplete();
        }
    });
    
    // Обработчик для удаления ингредиентов из сводки заказа
    selectedItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('selected-item')) {
            const ingredientName = e.target.textContent;
            const ingredientType = e.target.dataset.type;
            
            // Удаляем ингредиент из заказа
            if (ingredientType === 'base') {
                order.base = null;
                document.querySelectorAll('#base-list .ingredient-item').forEach(item => {
                    if (item.dataset.name === ingredientName) {
                        item.classList.remove('selected');
                    }
                });
                basePart.classList.remove('visible');
            } else if (ingredientType === 'sauce') {
                order.sauce = null;
                document.querySelectorAll('#sauce-list .ingredient-item').forEach(item => {
                    if (item.dataset.name === ingredientName) {
                        item.classList.remove('selected');
                    }
                });
                saucePart.classList.remove('visible');
            } else if (ingredientType === 'ingredient1') {
                order.ingredient1 = order.ingredient1.filter(item => item !== ingredientName);
                document.querySelectorAll('#ingredient1-list .ingredient-item').forEach(item => {
                    if (item.dataset.name === ingredientName) {
                        item.classList.remove('selected');
                    }
                });
            } else if (ingredientType === 'ingredient2') {
                order.ingredient2 = order.ingredient2.filter(item => item !== ingredientName);
                document.querySelectorAll('#ingredient2-list .ingredient-item').forEach(item => {
                    if (item.dataset.name === ingredientName) {
                        item.classList.remove('selected');
                    }
                });
            }
            
            // Обновляем визуализацию
            updatePizzaVisualization();
            
            // Обновляем сводку заказа
            updateOrderSummary();
            checkOrderComplete();
        }
    });
    
    // Обработчик для кнопки заказа
    orderBtn.addEventListener('click', function() {
        // Выводим заказ в консоль
        console.log('Заказ:', order);
        
        // Рассчитываем общую стоимость
        let total = 0;
        if (order.base) total += prices[order.base];
        if (order.sauce) total += prices[order.sauce];
        order.ingredient1.forEach(ing => total += prices[ing]);
        order.ingredient2.forEach(ing => total += prices[ing]);
        
        // Показываем уведомление
        alert(`Заказ успешно сформирован!\n\nИтого к оплате: ${total} ₽`);
    });
    
    // Функция для обновления сводки заказа
    function updateOrderSummary() {
        selectedItemsContainer.innerHTML = '';
        
        // Добавляем основу
        if (order.base) {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.textContent = order.base;
            item.dataset.type = 'base';
            selectedItemsContainer.appendChild(item);
        }
        
        // Добавляем соус
        if (order.sauce) {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.textContent = order.sauce;
            item.dataset.type = 'sauce';
            selectedItemsContainer.appendChild(item);
        }
        
        // Добавляем ингредиенты 1
        order.ingredient1.forEach(ing => {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.textContent = ing;
            item.dataset.type = 'ingredient1';
            selectedItemsContainer.appendChild(item);
        });
        
        // Добавляем ингредиенты 2
        order.ingredient2.forEach(ing => {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.textContent = ing;
            item.dataset.type = 'ingredient2';
            selectedItemsContainer.appendChild(item);
        });
        
        // Обновляем общую стоимость
        updateTotalPrice();
    }
    
    // Функция для обновления общей стоимости
    function updateTotalPrice() {
        let total = 0;
        
        if (order.base) total += prices[order.base];
        if (order.sauce) total += prices[order.sauce];
        order.ingredient1.forEach(ing => total += prices[ing]);
        order.ingredient2.forEach(ing => total += prices[ing]);
        
        totalPriceElement.textContent = `Итого: ${total} ₽`;
    }
    
    // Функция для проверки завершенности заказа
    function checkOrderComplete() {
        const isComplete = order.base && order.sauce && order.ingredient1.length > 0 && order.ingredient2.length > 0;
        orderBtn.disabled = !isComplete;
    }
    
    // Функция для обновления визуализации пиццы
    function updatePizzaVisualization() {
        // Очищаем предыдущие топпинги
        ingredient1Part.innerHTML = '';
        ingredient2Part.innerHTML = '';
        
        // Добавляем ингредиенты 1
        if (order.ingredient1.length > 0) {
            ingredient1Part.classList.add('visible');
            
            // Создаем элементы для визуализации
            order.ingredient1.forEach(ing => {
                for (let i = 0; i < 8; i++) {
                    const angle = (i * 45) * (Math.PI / 180);
                    const radius = 100;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    
                    const topping = document.createElement('div');
                    topping.className = 'topping';
                    topping.style.backgroundColor = ingredientColors[ing];
                    topping.style.left = `calc(50% + ${x}px - 15px)`;
                    topping.style.top = `calc(50% + ${y}px - 15px)`;
                    ingredient1Part.appendChild(topping);
                }
            });
        } else {
            ingredient1Part.classList.remove('visible');
        }
        
        // Добавляем ингредиенты 2
        if (order.ingredient2.length > 0) {
            ingredient2Part.classList.add('visible');
            
            // Создаем элементы для визуализации
            order.ingredient2.forEach((ing, index) => {
                for (let i = 0; i < 12; i++) {
                    const angle = (i * 30 + index * 15) * (Math.PI / 180);
                    const radius = 70 + index * 10;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    
                    const topping = document.createElement('div');
                    topping.className = 'topping';
                    topping.style.backgroundColor = ingredientColors[ing];
                    topping.style.left = `calc(50% + ${x}px - 15px)`;
                    topping.style.top = `calc(50% + ${y}px - 15px)`;
                    topping.style.width = `${20 + index * 2}px`;
                    topping.style.height = `${20 + index * 2}px`;
                    ingredient2Part.appendChild(topping);
                }
            });
        } else {
            ingredient2Part.classList.remove('visible');
        }
    }
});