import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    console.log('Settings:', settings);
    console.log('Before templates:', before);
    console.log('After templates:', after);
    console.log('Root container:', root.container);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

    const beforeReversed = [...before];

    beforeReversed.reverse().forEach(subName => {
        console.log(`Cloning template: "${subName}"`);
        const subTemplate = cloneTemplate(subName);
        console.log('Result:', subTemplate);

        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    after.forEach(subName => {
        console.log(`Cloning template: "${subName}"`);
        const subTemplate = cloneTemplate(subName);
        console.log('Result:', subTemplate);


        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()

    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction(), 0);
    });

    root.container.addEventListener('submit', (e) =>{
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        
        const nextRows = data.map(item => {
            // Клонируем содержимое шаблона
            const row = cloneTemplate(rowTemplate)
            
            // Заполняем данными (пример через data-атрибуты)
            // Предполагая, что в шаблоне есть элементы с data-field="name", data-field="value" и т.д.
            Object.keys(item).forEach((key) => {
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                }
            });
            
            return row.container;
        });
        
        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}