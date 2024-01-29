"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getData = async (nameJson) => {
    try {
        const response = await fetch(`./data/${nameJson}.json`);
        return await response.json();
    }
    catch (error) {
        console.error('Произошла ошибка', error);
        return Promise.reject(error);
    }
};
const getNameJson = () => {
    let jsonDropdown = document.getElementById("jsonDropdown");
    return jsonDropdown.options[jsonDropdown.selectedIndex].value;
};
const createTextInput = (attrs) => {
    const input = document.createElement('input');
    input.className = 'input-main';
    Object.keys(attrs).forEach((attr) => input.setAttribute(attr, String(attrs[attr])));
    return input;
};
const createTextareaInput = (attrs) => {
    const textarea = document.createElement('textarea');
    Object.keys(attrs).forEach((attr) => textarea.setAttribute(attr, String(attrs[attr])));
    textarea.className = 'input-main';
    return textarea;
};
const createCheckboxAndRadioInput = (attrs) => {
    const checkboxRadioGroup = document.createElement('div');
    checkboxRadioGroup.className = 'flex flex-col';
    if (attrs.variants) {
        attrs.variants.forEach((variant) => {
            const label = document.createElement('label');
            const checkboxRadio = document.createElement('input');
            checkboxRadio.type = attrs.type;
            checkboxRadio.name = attrs.name;
            checkboxRadio.value = variant.value;
            checkboxRadio.className = 'mr-2';
            label.appendChild(checkboxRadio);
            label.appendChild(document.createTextNode(variant.label));
            label.className = 'text-xl';
            checkboxRadioGroup.appendChild(label);
        });
    }
    return checkboxRadioGroup;
};
const createSelectInput = (attrs) => {
    const selectGroup = document.createElement('div');
    const select = document.createElement('select');
    select.className = 'input-main';
    Object.keys(attrs).forEach((attr) => select.setAttribute(attr, String(attrs[attr])));
    attrs.variants.forEach((variant) => {
        const option = document.createElement('option');
        option.value = variant.value;
        option.text = variant.label;
        select.appendChild(option);
    });
    selectGroup.appendChild(select);
    return selectGroup;
};
const createButtons = (buttons) => {
    const buttonsGroup = document.createElement('div');
    buttonsGroup.className = 'mt-4';
    for (let attr of buttons) {
        const button = document.createElement('button');
        button.className = 'bg-color-333 text-white text-xl py-2 px-10 rounded-full font-light mr-5';
        button.innerHTML = attr;
        if (attr == 'clear')
            attr = 'reset';
        button.setAttribute('type', attr);
        buttonsGroup.appendChild(button);
    }
    return buttonsGroup;
};
const printFieldsForm = async () => {
    if (document.getElementById('formCont')) {
        let el = document.getElementById('formCont');
        el && el.remove();
    }
    if (getNameJson()) {
        const data = await getData(getNameJson());
        const title = document.createElement("h2");
        title.innerHTML = data.title;
        title.className = 'text-2xl text-center';
        let cont = document.createElement("div");
        cont.className = 'flex justify-center bg-white rounded w-1/3 py-6 my-10 mx-auto';
        cont.setAttribute('id', 'formCont');
        let form = document.createElement("form");
        form.className = 'w-[384px]';
        form.setAttribute('id', 'anyForm');
        form.appendChild(title);
        data.fields.forEach((field) => {
            const inputGroup = document.createElement("div");
            inputGroup.className = 'flex flex-col mt-5';
            const label = document.createElement('label');
            label.innerHTML = field.label;
            label.className = 'mb-4 text-xl';
            inputGroup.appendChild(label);
            const type = field.attrs.type;
            ['radio', 'checkbox'].includes(type) ?
                inputGroup.appendChild(createCheckboxAndRadioInput(field.attrs)) :
                (type === 'select') ?
                    inputGroup.appendChild(createSelectInput(field.attrs)) :
                    (type === 'textarea') ?
                        inputGroup.appendChild(createTextareaInput(field.attrs)) :
                        inputGroup.appendChild(createTextInput(field.attrs));
            form.appendChild(inputGroup);
        });
        data.buttons && form.appendChild(createButtons(data.buttons));
        if (document.getElementById('selectForm')) {
            const select = document.getElementById('selectForm');
            cont.appendChild(form);
            select.insertAdjacentElement('afterend', cont);
            if (document.getElementById('anyForm')) {
                let anyForm = document.getElementById('anyForm');
                anyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(anyForm);
                    formData.forEach((data, name) => {
                        console.log(name + ': ' + data);
                    });
                });
            }
        }
    }
};
