import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison({
        // Пропускаем пустые значения в state (если поиск не введён)
        skipEmptyTargetValues: rules.skipEmptyTargetValues,
        
        // Ищем по нескольким полям: date, customer, seller
        // searchField — имя поля в state (например, 'search')
        // false — поиск подстроки (не точное совпадение)
        searchMultipleFields: rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    });

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        
        // Если в state есть непустое значение для поиска
        if (state[searchField]) {
            // Фильтруем данные, оставляя только те строки, где compare вернёт true
            return data.filter(row => compare(row, state));
        }
        
        // Если поиск не задан — возвращаем все данные
        return data;
    }
}