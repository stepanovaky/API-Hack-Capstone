'use strict'

const apikey = '0cefe77730501ffa5370c7079f559a9a';
const CORS = 'https://cors-anywhere.herokuapp.com/';


//show all added items

function loadAllPreviousItems() {

    const params = {
        apikey: apikey
    };

    const showAllItemsURL = 'http://beta.dorisapp.com/api/1_0/tasks/view_all.json';
    const queryURL = formatAddItemQuery(params);
    const fullURL = showAllItemsURL + '?' + queryURL;
    console.log(fullURL);

    fetch(CORS+fullURL)
        .then(response =>  {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayPreviousItems(responseJson))
        .catch(err => {
            alert(`Something went wrong: ${err.message}`)
        });
}


function displayPreviousItems(responseJson) {
    
    for (let i = 0; i < responseJson.length; i++) {
        for (let a = 0; a < responseJson[i].todos.length; a++) {
            
            $(`.${responseJson[i].todos[a].todo_group_id}`).append(`<form class="${responseJson[i].todos[a].todo_id} deleteItem" id="${responseJson[i].todos[a].todo_id}">
            <input type="checkbox"  value="0" class="${responseJson[i].todos[a].todo_id}"> <p class="${responseJson[i].todos[a].todo_id}">${responseJson[i].todos[a].description}</p>
            <select class="deletion">
            <option value="${responseJson[i].todos[a].todo_id}">Delete</option>
            </select>
            <label for="delete-button"></label>
            <input type="submit" value="Delete" name="delete-button" id="delete-button">
            </form>`)
            
        }
    }

    $(watchDeleteForm());
    $(updateStatusofCheckedItem());
}




//add items to list and rate importance
function addItems(items, importance) {
    const params = {
        apikey: apikey,
        description: items,
        todo_group_id: importance
    };

    const addItemAPIURL = "http://beta.dorisapp.com/api/1_0/tasks/create.json"

    const queryURL = formatAddItemQuery(params);
    const fullURL = addItemAPIURL + '?' + queryURL;
    console.log(fullURL);
    
    fetch(CORS+fullURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayAddItems(responseJson, importance, items))
        .catch(err => {
            alert(`Something went wrong: ${err.message}`)
        });
}

function displayAddItems(responseJson, importance, items) {
    console.log(responseJson);
    $(`.${importance}`).append(`<form class="${responseJson.DRS_Success.message} deleteItem" id="${responseJson.DRS_Success.message}">
    <input type="checkbox"  value="0" class="${responseJson.DRS_Success.message}"> <p class="${responseJson.DRS_Success.message}">${items}</p>
    <select class="deletion">
        <option value="${responseJson.DRS_Success.message}">Delete</option>
    </select>
    <label for="delete-button"></label>
    <input type="submit" value="Delete" name="delete-button" id="delete-button">
    </form>`)
    $(watchDeleteForm());
    $(updateStatusofCheckedItem());

}

//updates API of item status 
function updateAPIStatusofCheckedItem(status, id) {
    console.log('updateAPIStatusofCheckedItem ran');

    const params = {
        apikey: apikey, 
        todo_id: id,
        status: status
    }

    const updateStatusURL = "http://beta.dorisapp.com/api/1_0/tasks/update_status.json";
    const queryURL = formatAddItemQuery(params);
    const fullURL = updateStatusURL + '?' + queryURL;

    fetch(CORS+fullURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .catch(err => {
            alert(`Something went wrong: ${err.message}`)
        });
}

//update item that is checked to be completed
function updateStatusofCheckedItem() {
   
    $('input:checkbox').click('on', function(event) {

        const classOfItem = $(this).parent('form').attr("class");
        const idOfItem = classOfItem.slice(0, 6);

        if ($(this).val() == 0) { //couldn't use '==='
            $(this).attr("value", 1);
            $(this).siblings().addClass("checked");
            console.log($('input:checkbox').val());
        } else if ($(this).val() == 1) {
            $(this).attr("value", 0);
            $(this).siblings().removeClass("checked");
            console.log($(this).val());

        };
        updateAPIStatusofCheckedItem($('input:checkbox').val(), idOfItem);
    });
    
}


//formats the query
function formatAddItemQuery(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');


}


//delete items from list
function deleteFromList(itemToDelete) {

    const params = {
        apikey: apikey,
        todo_id: itemToDelete
    }

    const queryURL = formatAddItemQuery(params);
    const deleteItemAPIURL = "http://beta.dorisapp.com/api/1_0/tasks/delete.json";
    const fullURL = deleteItemAPIURL + '?' + queryURL;
    console.log(fullURL);

    fetch(CORS+fullURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .catch(err => {
            alert(`Something went wrong: ${err.message}`)
        });

}

//change importance


//sort items

//watch delete button

function watchDeleteForm() {
    $('.deleteItem').submit(event => {
        event.preventDefault();
        $(event.target).empty(event.target);
        const itemToDelete = event.target.id;
        console.log(itemToDelete);
        deleteFromList(itemToDelete);
    });
    console.log('watchdeleteform ran');
};



function watchAddForm() {
    $('.add').submit(event => {
        event.preventDefault();
        console.log('submit ran');
        const addTask = $('#add-task').val();
        const rateTask = $('#importance').val();
        addItems(addTask, rateTask);
        $('input:text').val("");
        
    });
   
      console.log('watchaddform ran');
};
  
function runAllFunctions() {
    $(loadAllPreviousItems());
    $(watchAddForm());
    
    
}

$(runAllFunctions());
