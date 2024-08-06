// Inicial: obtener datos de localStorage
let healthServices = JSON.parse(localStorage.getItem("healthServices")) || [];

// Condición que revisa si healthServices tiene un valor truthy
if (!healthServices || healthServices.length === 0) {
    healthServicesId = 1;
} else {
    healthServicesId = healthServices[healthServices.length - 1].id + 1;
}

let basePrice = 0;
let serviceType = "";
let serviceTypeFactor = 0;
let ageFactor = 0;
let totalPrice = 0;
let healthServicesArray = [];
let deleteChoice;
let healthServiceObject;
let filteredServicesArray = [];
let healthServicesAvailability = [
    { name: "medicina general", availableDoctors: 10, availableDate: "2024-08-5" },
    { name: "medicina familiar", availableDoctors: 5, availableDate: "2024-08-5" },
    { name: "medicina interna", availableDoctors: 4, availableDate: "2024-08-7" },
    { name: "cirugia", availableDoctors: 4, availableDate: "2024-08-9" },
    { name: "ginecologia", availableDoctors: 4, availableDate: "2024-08-12" },
    { name: "psiquiatria", availableDoctors: 5, availableDate: "2024-08-15" },
    { name: "dermatologia", availableDoctors: 2, availableDate: "2024-08-16" },
]

let availableDoctors = "";
let availableDate;
let searchName;
let ageY;

// Cálculo de edad a partir de fecha de nacimiento
let calculoEdad = () => {
    let now = new Date();
    let currentY = now.getFullYear();
    let dobget = document.getElementById("fechanacimiento").value;
    let dob = new Date(dobget);
    let prevY = dob.getFullYear();
    ageY = currentY - prevY;

    document.getElementById('edadEnAnos').innerHTML = ageY + ' años ';
}

// Cálculo de factor de precio de ISAPRE

let isapreCalc = (isapreCompany) => {
    switch (isapreCompany) {
        case "banmedica":
        case "consalud":
            basePrice = 8000;
            break;
        case "colmena":
        case "cruzblanca":
        case "masvida":
            basePrice = 11000;
            break;
        case "vidatres":
        case "esencial":
            basePrice = 16000;
            break;
        default:
            alert("Dato de ISAPRE incorrecto, ingrese nuevamente");
    }
}

// Cálculo de factor de precio por especialidad
// Además, agrega disponibilidad de médicos y próxima fecha disponible

let serviceCalc = (serviceType) => {
    switch (serviceType) {
        case "Medicina general":
            serviceTypeFactor = 1;
            availableDoctors = 10;
            availableDate = "2024-08-5";
            break;
        case "Medicina familiar":
            serviceTypeFactor = 1.3;
            availableDoctors = 5;
            availableDate = "2024-08-5";
            break;
        case "Medicina interna":
            serviceTypeFactor = 1.5;
            availableDoctors = 4;
            availableDate = "2024-08-7";
            break;
        case "Cirugía":
            serviceTypeFactor = 1.5;
            availableDoctors = 4;
            availableDate = "2024-08-9";
            break;
        case "Ginecología":
            serviceTypeFactor = 1.5;
            break;
        case "Psiquiatría":
            serviceTypeFactor = 1.8;
            availableDoctors = 5;
            availableDate = "2024-08-15"
            break;
        case "Dermatología":
            serviceTypeFactor = 1.8;
            availableDoctors = 2;
            availableDate = "2024-08-16";
            break;
        default:
            alert("Dato de especialidad incorrecto, ingrese nuevamente");
    }
}

// Cálculo de factor de precio por edad

let ageCalc = (patientAge) => {
    if (patientAge >= 65) {
        ageFactor = 1.65;
    }
    else if (patientAge >= 45) {
        ageFactor = 1.5;
    }
    else if (patientAge >= 35) {
        ageFactor = 1.35;
    }
    else if (patientAge >= 18) {
        ageFactor = 1.25;
    }
    else if (patientAge <= 19) {
        ageFactor = 1;
    }
    else {
        alert("Dato de edad inválido, ingrese nuevamente");
    }
}

// Cálculo de precio final basado en los tres factores

function calculateTotalPrice(basePrice, serviceTypeFactor, ageFactor) {
    totalPrice = basePrice * serviceTypeFactor * ageFactor;
    return totalPrice;
}

// Función botón submit, que calcula todo tras mandar todo los datos, hartas funciones

let submitButtonProc = () => {
    // Manejo de inputs
    let nombrePcte = document.getElementById("nameInput").value;
    let fonoPcte = document.getElementById("phoneInput").value;
    let emailPcte = document.getElementById("emailInput").value;
    let isapreCompany = document.getElementById("isapreInput").value;
    let serviceType = document.getElementById("serviceInput").value;
    let edadPcte = ageY;

    // Cálculo de precio total
    isapreCalc(isapreCompany);
    serviceCalc(serviceType);
    ageCalc(edadPcte);
    calculateTotalPrice(basePrice, serviceTypeFactor, ageFactor);
    console.log(`Precio total: CLP$${totalPrice}`);

    // Creación del objeto y actualización del id
    healthServiceObject = { id: healthServicesId, name: nombrePcte, phone: fonoPcte, email: emailPcte, isapre: isapreCompany, service: serviceType, factor: (serviceTypeFactor * ageFactor), price: totalPrice, availability: availableDoctors, nextdate: availableDate };
    healthServices.push(healthServiceObject);
    console.log(healthServices);
    healthServicesId++;

    // Agrego la atención al localstorage healthServices, y renderizo de nuevo
    localStorage.setItem("healthServices", JSON.stringify(healthServices));
    cardRenderer();
}

// Botones enviar y eliminar

let submitButton = document.getElementById("submit-btn");
submitButton.addEventListener("click", submitButtonProc);

// TO-DO: Creación del texto "ya tiene consultas"

// Creación de las tarjetas

function createCard(service) {
    let card = document.createElement('div');
    card.className = 'card';

// Relleno de datos a cada tarjeta

    let title = document.createElement('h2');
    title.textContent = `${service.service}, ID: ${service.id}`;
    card.appendChild(title);

    let name = document.createElement('h2');
    name.textContent = service.name;
    card.appendChild(name);

    let nextdate = document.createElement('p');
    nextdate.textContent = `Siguiente fecha disponible: ${service.nextdate}`;
    card.appendChild(nextdate);

    let availability = document.createElement('p');
    availability.textContent = `Médicos disponibles: ${service.availability}`;
    card.appendChild(availability);

    let price = document.createElement('p');
    price.textContent = `precio: $${service.price}`;
    card.appendChild(price);

// Implementación del botón de eliminar para cada tarjeta
    
    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.id = `delete-btn-${service.id}`;
    deleteButton.textContent = "Eliminar"
    deleteButton.addEventListener('click', () => deleteCard(service.id));

    card.appendChild(deleteButton);

    return card;
}

let cardContainer = document.getElementById('card-container');

// Función de renderizado "repintado" de tarjetas
let cardRenderer = () => {
    cardContainer.innerHTML = '';
    healthServices.forEach(service => {
        const card = createCard(service);
        cardContainer.appendChild(card);
    });
}

// Función de eliminación de tarjetas, también repinta
let deleteCard = (id) => {
    healthServices = healthServices.filter(service => service.id !== id);
    localStorage.setItem("healthServices", JSON.stringify(healthServices));
    cardRenderer();
}

// Renderizado inicial de tarjetas
cardRenderer();