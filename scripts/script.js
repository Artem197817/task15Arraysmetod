$(document).ready(function () {
    let cities = [];
    let persons = [];
    let specializations = [];

    Promise.all([
        fetch('source/cities.json'),
        fetch('source/person.json'),
        fetch('source/specializations.json'),
    ])
        .then(async ([citiesResponse, personsResponse, specializationsResponse]) => {
            const citiesJson = await citiesResponse.json();
            const personsJson = await personsResponse.json();
            const specializationsJson = await specializationsResponse.json();
            return [citiesJson, personsJson, specializationsJson];
        })
        .then(response => {
            cities = response[0];
            persons = response[1];
            specializations = response[2];


            specializationSkill(specialization(persons, specializations, 'designer'), 'figma')
                .forEach(person => {
                    console.log(getInfo.call(person));
                })
            reactDeveloper(persons, 'react');

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });


    /** Создайте самостоятельную функцию getInfo, которая будет возвращать в
     * одной строке имя, фамилию и город пользователя, используя this.
     * Эта функция будет использоваться для вывода
     * полного имени в вашем коде, вызывать ее нужно будет с помощью метода call.*/
    function getInfo() {
        let city = cities.find(item => item.id === this.personal.locationId);
        return `${this.personal.firstName} ${this.personal.lastName}, ${city ? city.name : 'Unknown City'}`;
    }

    /** Найдите среди пользователей всех дизайнеров,
     * которые владеют Figma и выведите данные о них в консоль с помощью getInfo.*/
    function specialization(persons, specializations, specialization) {
        let specializationSearchId = specializations.find(item => item.name.toLowerCase() === specialization).id;
        return persons.filter(person => {
            return person.personal.specializationId === specializationSearchId;
        });
    }

    function specializationSkill(specializations, skill) {
        return specializations.filter(person => {
            if (person.skills.find(item => item.name.toLowerCase() === skill.toLowerCase()))
                return person;
        });
    }
/** Найдите первого попавшегося разработчика, который владеет React.
 * Выведите в консоль через getInfo данные о нем.*/

function reactDeveloper(persons, skill) {
    const developer = persons.find(person =>
        person.skills.some(item => item.name.toLowerCase() === skill.toLowerCase()));

    if (developer) {
        console.log(getInfo.call(developer));
    } else {
        console.log('No developer found with the specified skill.');
    }
}




});