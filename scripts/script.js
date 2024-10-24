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

            outputPersonList(
                specializationSkill(
                    specialization(persons, specializations, 'designer'), 'figma'), ' Дизайнеры Figma');


            someSkillDeveloper(persons, 'react');

            checkAge(persons, 18);

            outputPersonList(
                salaryPersonalSorted(
                    timeEmployment(cityPersonal(
                            specialization(persons, specializations, 'backend'), cities, 'Москва'
                        ), 'Полная'
                    )
                ), 'Backend из Москвы на полный день'
            )

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

    function outputPersonList(listPerson, message){
        console.log(message);
        listPerson.forEach((person) => {
            console.log(getInfo.call(person))
        })
    }

    /** Найдите среди пользователей всех дизайнеров,
     * которые владеют Figma и выведите данные о них в консоль с помощью getInfo.*/
    function specialization(persons, specializations, specialization) {
        let specializationSearchId = specializations
            .find(item => item.name.toLowerCase() === specialization)
            .id;
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

    function someSkillDeveloper(persons, skill) {
        const developer = persons.find(person =>
            person.skills
                .some(item => item.name.toLowerCase() === skill.toLowerCase()));

        if (developer) {
            console.log(skill)
            console.log(getInfo.call(developer));
        } else {
            console.log(skill)
            console.log('No developer found with the specified skill.');
        }
    }
/** Проверьте, все ли пользователи старше 18 лет. Выведите результат проверки в консоль.*/
function checkAge(persons, controlAge){
    isAge = false;
    persons.forEach(person => {
        if (calculateAge(person.personal.birthday) <= controlAge) isAge = true;
    })
    console.log(isAge? 'Не все пользователи старше ' + controlAge + ' лет': 'Все пользователи старше ' + controlAge + ' лет')

}

    function calculateAge(birthday) {

        const [day, month, year] = birthday.split('.').map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassed) {
            age--;
        }

        return age;
    }
/**Найдите всех backend-разработчиков из Москвы, которые ищут работу на полный день
 * и отсортируйте их в порядке возрастания зарплатных ожиданий. */


function cityPersonal(listPersonal, cities, cityName) {
    let cityId = cities.find(item => item.name === cityName).id;
    return listPersonal.filter(person => {
        return person.personal.locationId === cityId;
    });
}

function salaryPersonalSorted (listPersonal) {
    function salaryPerson(person){
        return +(person.request.find(item => item.name === 'Зарплата').value);
    }
    return listPersonal.sort((a, b) => salaryPerson(a) - salaryPerson(b));
}

function timeEmployment(listPersonal, type) {

    return listPersonal.filter(person => {
        return person.request.find(item => item.name === 'Тип занятости').value === type;
    })
}




});