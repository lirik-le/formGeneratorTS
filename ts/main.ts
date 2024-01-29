import {Data, Attrs, Variant} from "./types";

const getData = async (nameJson: string): Promise<Data> => {
    try {
        const response = await fetch(`./data/${nameJson}.json`);
        return await response.json();
    } catch (error) {
        console.error('Произошла ошибка', error);
        return Promise.reject(error);
    }
}

const getNameJson = (): string => {
    let jsonDropdown: HTMLSelectElement = document.getElementById("jsonDropdown") as HTMLSelectElement;
    return jsonDropdown.options[jsonDropdown.selectedIndex].value;
}

const createTextInput = (attrs: Attrs): HTMLInputElement => {
    const input: HTMLInputElement = document.createElement('input');
    input.className = 'input-main';
    Object.keys(attrs).forEach((attr: string) => input.setAttribute(attr, String(attrs[attr])));

    return input;
}

const createTextareaInput = (attrs: Attrs): HTMLTextAreaElement => {
    const textarea: HTMLTextAreaElement = document.createElement('textarea');
    Object.keys(attrs).forEach((attr: string) => textarea.setAttribute(attr, String(attrs[attr])));
    textarea.className = 'input-main';

    return textarea;
}

const createCheckboxAndRadioInput = (attrs: Attrs): HTMLDivElement => {
    const checkboxRadioGroup: HTMLDivElement = document.createElement('div');
    checkboxRadioGroup.className = 'flex flex-col';

    if (attrs.variants) {
        attrs.variants.forEach((variant: Variant) => {
            const label: HTMLLabelElement = document.createElement('label');
            const checkboxRadio: HTMLInputElement = document.createElement('input');

            checkboxRadio.type = attrs.type;
            checkboxRadio.name = attrs.name;
            checkboxRadio.value = variant.value;
            checkboxRadio.className = 'mr-2';

            label.appendChild(checkboxRadio);
            label.appendChild(document.createTextNode(variant.label));
            label.className = 'text-xl'

            checkboxRadioGroup.appendChild(label);
        });
    }

    return checkboxRadioGroup;
}

const createSelectInput = (attrs: Attrs): HTMLDivElement => {
    const selectGroup: HTMLDivElement = document.createElement('div');
    const select: HTMLSelectElement = document.createElement('select');
    select.className = 'input-main';

    Object.keys(attrs).forEach((attr: string) => select.setAttribute(attr, String(attrs[attr])));

    attrs.variants.forEach((variant: Variant) => {
        const option: HTMLOptionElement = document.createElement('option');
        option.value = variant.value;
        option.text = variant.label;
        select.appendChild(option);
    });

    selectGroup.appendChild(select);
    return selectGroup;
}

const createButtons = (buttons: string[]): HTMLDivElement => {
    const buttonsGroup: HTMLDivElement = document.createElement('div');
    buttonsGroup.className = 'mt-4';

    for (let attr of buttons) {
        const button: HTMLButtonElement = document.createElement('button');
        button.className = 'bg-color-333 text-white text-xl py-2 px-10 rounded-full font-light mr-5';
        button.innerHTML = attr;

        if (attr == 'clear') attr = 'reset';
        button.setAttribute('type', attr)

        buttonsGroup.appendChild(button);
    }

    return buttonsGroup;
}

const printFieldsForm = async (): Promise<void> => {
    if (document.getElementById('formCont')) {
        let el: HTMLElement= document.getElementById('formCont')!;
        el && el.remove();
    }

    if (getNameJson()) {
        const data: Data = await getData(getNameJson());
        const title: HTMLHeadingElement = document.createElement("h2")
        title.innerHTML = data.title;
        title.className = 'text-2xl text-center';

        let cont: HTMLDivElement =  document.createElement("div");
        cont.className = 'flex justify-center bg-white rounded w-1/3 py-6 my-10 mx-auto';
        cont.setAttribute('id', 'formCont');

        let form: HTMLFormElement = document.createElement("form");
        form.className = 'w-[384px]';
        form.setAttribute('id', 'anyForm');
        form.appendChild(title);

        data.fields.forEach((field) => {
            const inputGroup: HTMLDivElement = document.createElement("div");
            inputGroup.className = 'flex flex-col mt-5';

            const label: HTMLLabelElement = document.createElement('label');
            label.innerHTML = field.label;
            label.className = 'mb-4 text-xl';
            inputGroup.appendChild(label);

            const type: string = field.attrs.type;

            ['radio', 'checkbox'].includes(type) ?
                inputGroup.appendChild(createCheckboxAndRadioInput(field.attrs)) :
                (type === 'select') ?
                    inputGroup.appendChild(createSelectInput(field.attrs)) :
                    (type === 'textarea') ?
                        inputGroup.appendChild(createTextareaInput(field.attrs)) :
                        inputGroup.appendChild(createTextInput(field.attrs));

            form.appendChild(inputGroup);
        })

        data.buttons && form.appendChild(createButtons(data.buttons));

        if (document.getElementById('selectForm')) {
            const select: HTMLElement = document.getElementById('selectForm')!;
            cont.appendChild(form);
            select.insertAdjacentElement('afterend', cont);

            if (document.getElementById('anyForm')) {
                let anyForm: HTMLFormElement = document.getElementById('anyForm')! as HTMLFormElement;

                anyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(anyForm);
                    formData.forEach((data, name) => {
                        console.log(name + ': ' + data)
                    })
                });
            }
        }
    }
}

