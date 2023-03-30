import React, { useState } from 'react';
import "./App.css"; // Optional CSS file for styling
import $ from 'jquery';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button, Form, Nav } from 'react-bootstrap';

function parseTime(timeString) {
  let [time, dayOfWeek, month, dayOfMonth, year] = timeString.split(' ');
  let [hours, minutes, seconds] = time.split(':').map(Number);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let monthIndex = months.indexOf(month);
  return new Date(year, monthIndex, dayOfMonth, hours, minutes, seconds);
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const tabs = ["Enable Table", "Current Table", "Order History", "Add Food", "Delete Food"];
  const [PageData, setPageData] = useState([]);

  
  useEffect( () => {
      $.ajax({
        type: 'POST',
        url: ' https://sdp2023-dbapi.herokuapp.com/rsignin',
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        data: {
          name: '',
          password: ''
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
        success: function(response) {
          if (response == 'logined'){
            setIsLoggedIn(true);
          }else{
            //alert(response)
          }
          setIsLoaded(true);
        },
        error: function(error) {
          console.error(error);
        }
      });
      
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    var name = event.target.username.value;
    var password = event.target.password.value; 
    $.ajax({
      type: 'POST',
      url: ' https://sdp2023-dbapi.herokuapp.com/rsignin',
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      data: {
        name: name,
        password: password
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      success: function(response) {
        if (response == 'logined'){
          setIsLoggedIn(true);
        }else{
            alert(response)
        }
      },
      error: function(error) {
        console.error(error);
      }
    });
  };


  const handleLogout = () => {
    var log=false;
    var reply = window.confirm('Are you sure to quit editing the note and log out?')
    if (reply){
      log=true;
    }
    if(log){
      $.ajax({
        type: 'GET',
        url: 'https://sdp2023-dbapi.herokuapp.com/rlogout',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        success: function(response) {
          setIsLoggedIn(false); 
          Cookies.remove('managerId');
          console.log(response);
        },
        error: function(error) {
          console.error(error);
        }
    });
    }  
  }

  const handleTabClick = (index) => {
    //setActiveTab(index);
    if (index == 0){
      EnablePageClick(index);
    }else if (index == 1){
      CurrentTablePageClick(index);
    }else if (index == 2){
      OrderHistoryPageClick(index);
    }else if (index == 3){
      setActiveTab(index)
    }else if (index == 4){
      DeleteFoodPageClick(index);
    };
    
  };

  const EnablePageClick = (index) => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/enablepage',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      success: function(response) {
        setPageData(response);
        setActiveTab(index);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  const CurrentTablePageClick = (index) => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/currentorderpage',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      success: function(response) {
        const sortedData = response.sort((a, b) => parseInt(a.table) - parseInt(b.table));
        setActiveTab(index);
        setPageData(sortedData);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  const OrderHistoryPageClick = (index) => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/search',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      data:{
        day:'',
        month:'',
        year:''
      },
      success: function(response) {
        response.sort((orderA, orderB) => {
          let dateA = parseTime(orderA.time);
          let dateB = parseTime(orderB.time);
          return dateB - dateA;
        });
        setPageData(response);
        setActiveTab(index);
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  const DeleteFoodPageClick = (index) => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/deletepage',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      success: function(response) {
        setPageData(response);
        setActiveTab(index);
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };


  if (isLoaded){
    return (
      <div className="App">
        <header className="App-header">
              <img src="/logo.png" alt="Restaurant Logo" className="logo" />
              {isLoggedIn && (<button onClick={handleLogout} className="logout">Logout</button>)}
        </header>
        {!isLoggedIn && (
          
          <div className="login-page">
            <form onSubmit={handleLogin} className='form-login'>
            <h2 className='form-header'>Management System</h2>
              <label className='username'>
                Username:
                <input type="text" name="username" className='nameinput'/>
              </label>
              <label className='password'>
                Password:
                <input type="password" name="password" className='passwordinput'/>
              </label>
              <button type="submit">Login</button>
            </form>
          </div>
        )}
        {isLoggedIn && (
          <>
            <div className="content">
              <div className="tab-list">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`tab-button ${index === activeTab ? "active" : ""}`}
                    onClick={() => handleTabClick(index)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="tab-content">
                {activeTab === 0 && <Enable  enableData={PageData}/>}
                {activeTab === 1 && <Current currentData={PageData} reload={CurrentTablePageClick} index={1} reSet = {setActiveTab}/>}
                {activeTab === 2 && <History historyData={PageData} reload={OrderHistoryPageClick} index={2} reSet = {setActiveTab}/>}
                {activeTab === 3 && <Add />}
                {activeTab === 4 && <Delete deleteData={PageData} reload={DeleteFoodPageClick} index={4} reSet = {setActiveTab}/>}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}


function Enable(props) {
  const tableCount = props.enableData.length;

  // Create an array of table numbers from 1 to tableCount
  const tableNumbers = Array.from({ length: tableCount }, (_, index) => index + 1);

  // Handle click event when the enable button is clicked
  const handleEnableClick = (tableNumber) => {
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/enable/'+tableNumber,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  return (
    <div>
      <p>Select a table to enable:</p>
      <ul>
        {tableNumbers.map((tableNumber) => (
          <li key={tableNumber}>
            Table {tableNumber} <button onClick={() => handleEnableClick(tableNumber)}>Enable</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


function Current(props) {
  //const [enabledTables, setEnabledTables] = useState(props.currentData); // Example array of enabled tables

  /*const [tables, setTables] = useState([
    { id: 1, name: 'Table 1' },
    { id: 2, name: 'Table 2' },
    { id: 3, name: 'Table 3' },
    { id: 4, name: 'Table 4' },
  ]);*/

  const [tables, setTables] = useState(props.currentData);

  const [selectedTable, setSelectedTable] = useState(null);

  /*const [foods, setFoods] = useState([
    { id: 1, name: 'Pizza' },
    { id: 2, name: 'Burger' },
    { id: 3, name: 'Salad' },
    { id: 4, name: 'Pasta' },
  ]);*/

  const [foods, setFoods] = useState([]);

  // Handle click event when a table row is clicked
  const handleTableRowClick = (table) => {
    console.log(`Selected table: ${table.table}`);
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/clicktable/'+table.table,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      crossDomain: true,
      success: function(response) {
        console.log(response);
        if (response != 'No food ordered yet!'){
          setFoods(response);
        }else{
          setFoods(null);
        }
        setSelectedTable(table);
        //interval;
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  /*const interval = setInterval((table) => {
    handleTableRowClick(table);
  }, 1000);*/

  // Handle click event when the back button is clicked
  const handleBackClick = () => {
    setSelectedTable(null);
  };

  // Handle click event when the check button is clicked
  const handleCheckClick = (table) => {
    //console.log(`Table ${tableNumber} is checked.`);
    var log=false;
    var reply = window.confirm(`Comfirm check table ${table.table} with $${table.price}?`)
    if (reply){
      log=true;
    }
    if(log){
      $.ajax({
        type: 'DELETE',
        url: 'https://sdp2023-dbapi.herokuapp.com/disable/'+table.table,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        success: function(response) {
          console.log(response);
          if (response == "Disabled"){
            props.reSet(null);
            props.reload(props.index);  
          }
        },
        error: function(error) {
          console.error(error);
        }
      });
    }
  };

  const handleDeleteClick = (table, quantity,food) => {
    var log=false;
    var reply = window.confirm(`Comfirm to delete food: ${food.foodName}?`)
    if (reply){
      log=true;
    }
    if(log){
      $.ajax({
        type: 'DELETE',
        url: 'https://sdp2023-dbapi.herokuapp.com/cancelfood/'+table.table,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        data:{
          foodid:food.id,
          quantity:quantity
        },
        success: function(response) {
          console.log(response);
          handleTableRowClick(table);
          props.reSet(null);
          props.reload(props.index);  
        },
        error: function(error) {
          console.error(error);
        }
      });
    }
  }
  return (
    <div>
      <h2>Current</h2>
      {selectedTable ? (
          <button className="back-button" onClick={handleBackClick}>
            Back
          </button>
        ) : null}
      <div className="table-list">
        {selectedTable ? (
          <div className="reservation-details">
            <h3>Reservation Details</h3>
            <p>Table: {selectedTable.table}</p>
          </div>
        ) : (
          <ul>
            {tables.map((table) => (
             <div className="table-row"> 
              <button key={table.tableId} onClick={() => handleTableRowClick(table)}>
                table {table.table}
              </button> 
              <button onClick={() => handleCheckClick(table)}>Check</button>
            </div>
            ))}
          </ul>
        )}
      </div>
      {selectedTable && foods ? (
        <div className="food-list">
          <h3>Food List</h3>
          <ul>
            {foods.map((food) => (
            <>
              <li>{food.foodName}</li>
              <input type="number" id={food.id} defaultValue ={1} min ={1} max={food.quantity}></input>
              <button onClick={() => handleDeleteClick(selectedTable, $(`#${food.id}`).val(), food)}>delete</button>
            </>
            ))}
          </ul>
        </div>
      ) : null}
      
    </div>
  );
}



function History(props) {
  const [selectedDate, setSelectedDate] = useState({
    day: '',
    month: '',
    year: '',
  });

  const now = new Date();
  var currentYear = now.toLocaleString("en-US", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
  });
  currentYear = parseInt(currentYear);

  const month = ['Jan','Feb','Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /*const [tables, setTables] = useState([
    { id: 1, name: 'Table 1' },
    { id: 2, name: 'Table 2' },
    { id: 3, name: 'Table 3' },
    { id: 4, name: 'Table 4' },
  ]);*/

  const [tables, setTables] = useState(props.historyData);

  const [selectedTable, setSelectedTable] = useState(null);

  /*const [foods, setFoods] = useState([
    { id: 1, name: 'Pizza' },
    { id: 2, name: 'Burger' },
    { id: 3, name: 'Salad' },
    { id: 4, name: 'Pasta' },
  ]);*/

  const [foods, setFoods] = useState([]);

  // Handle change event when a date selection is changed
  const handleDateChange = (event) => {
    setSelectedDate({
      ...selectedDate,
      [event.target.name]: event.target.value,
    });
  };

  // Handle click event when the search button is clicked
  const handleSearchClick = () => {
    $.ajax({
      type: 'POST',
      url: 'https://sdp2023-dbapi.herokuapp.com/search',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      crossDomain: true,
      data:{
        day:`${selectedDate.day}`,
        month:`${selectedDate.month}`,
        year:`${selectedDate.year}`
      },
      success: function(response) {
        response.sort((orderA, orderB) => {
          let dateA = parseTime(orderA.time);
          let dateB = parseTime(orderB.time);
          return dateB - dateA;
        });
        setTables(response);
      },
      error: function(error) {
        console.error(error);
      }
    });
    
  };

  // Handle click event when a table row is clicked
  const handleTableRowClick = (table) => {
    console.log(`Selected table: ${table.table}`);
    $.ajax({
      type: 'GET',
      url: 'https://sdp2023-dbapi.herokuapp.com/clickhistorytable/'+table._id,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
      xhrFields: { withCredentials: true },
      withCredentials: 'include',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      crossDomain: true,
      success: function(response) {
        setFoods(response);
        console.log(response);
        setSelectedTable(table);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  // Handle click event when the back button is clicked
  const handleBackClick = () => {
    setSelectedTable(null);
  };

  // Handle click event when the delete button is clicked
  const handleDeleteClick = (historyid) => {
    var log=false;
    var reply = window.confirm('Comfirm to delete?')
    if (reply){
      log=true;
    }
    if(log){
      $.ajax({
        type: 'DELETE',
        url: 'https://sdp2023-dbapi.herokuapp.com/deletehistory/'+historyid,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        success: function(response) {
          console.log(response);
          props.reSet(null);
          props.reload(props.index);  
        },
        error: function(error) {
          console.error(error);
        }
      });
    }
  };

  return (
    <div className="History">
      <header>
      {!selectedTable ? (
        <div className="date-selection">
          <select name="day" value={selectedDate.day} onChange={handleDateChange}>
            <option value="">Day</option>
            {[...Array(31)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <select name="month" value={selectedDate.month} onChange={handleDateChange}>
            <option value="">Month</option>
            {month.map((item, index) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select name="year" value={selectedDate.year} onChange={handleDateChange}>
            <option value="">Year</option>
            {[...Array(10)].map((_, index) => (
              <option key={ currentYear-parseInt(index) } value={currentYear-parseInt(index)}>
               {currentYear-parseInt(index)}
              </option>
            ))}
          </select>
          <button onClick={handleSearchClick}>Search</button>
        </div>
        ) : null}
        {selectedTable ? (
          <button className="back-button" onClick={handleBackClick}>
            Back
          </button>
        ) : null}
      </header>
      <div className="table-list">
        {selectedTable ? (
          <div className="reservation-details">
            <h3>Reservation Details</h3>
            <p>Table: {selectedTable.table}</p>
          </div>
        ) : (
          <ul>
            {tables.map((table) => (
             <div className='table-row'> 
              <button key={table._id} onClick={() => handleTableRowClick(table)}>
                history table {table.table}, time: {table.time}, totalPrice:{table.totalPrice}
              </button> 
              <button onClick={() => handleDeleteClick(table._id)}>Delete</button>
            </div>
            ))}
          </ul>
        )}
      </div>
      {selectedTable ? (
        <div className="food-list">
          <h3>Food List</h3>
          <ul>
            {foods.map((food) => (
              <li key={food.id}>{food.foodName}, quantity: {food.quantity}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}



function Add() {
  const [food, setFood] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    class: '',
    style: '',
    health: '',
    set: '',
    drink: '',
  });

    // Handle change event when a form field is changed
    const handleFieldChange = (event) => {
      const { name, value, type } = event.target;
  
      if (type === 'select-multiple') {
        // Concatenate the values of the selected options with a space separator
        const selectedOptions = Array.from(event.target.selectedOptions).map((option) => option.value).join(' ');
        setFood({
          ...food,
          [name]: selectedOptions,
        });
      } else {
        setFood({
          ...food,
          [name]: value,
        });
      }
    };
  
    const validateForm = (event) => {
      let checkboxes = document.querySelectorAll('.radio-group-class input[type="checkbox"]');
      let isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
      if (!isChecked) {
          alert('Please select at least one food class.');
      }
    };

    const classCheck = () => {
      let checkboxes = document.querySelectorAll('.radio-group-class input[type="checkbox"]:checked');
      let checkedValues = Array.from(checkboxes).map(checkbox => checkbox.value);
      let result = checkedValues.join(' ');
      if (result == ""){
        alert('Please select at least one food class.');
        return('-1');
      }else{
        return result;
      }
    }
  // Handle submit event when the form is submitted
  const handleSubmit = (event) => {
    event.preventDefault();
    var classData = classCheck();
    if (classData != '-1'){
      $.ajax({
        type: 'POST',
        url: 'https://sdp2023-dbapi.herokuapp.com/addfood',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        data:{
          name: food.name,
          type: food.type,
          price:food.price,
          description:  food.description,
          class: classData,
          style: food.style,
          health: food.health,
          set: food.set,
          drink: food.drink
        },
        success: function(response) {
          if (response == 'Add success'){
            alert(response);
          }
        },
        error: function(error) {
          console.error(error);
        }
      })
    }
  };


  return (
    <div className="Add">
      <h2>Add Food</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={food.name} onChange={handleFieldChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="type">Type:</label>
          <select name="type" value={food.type} onChange={handleFieldChange} required>
            <option value="">Select type...</option>
            <option value="rice">Rice</option>
            <option value="noodle">Noodle</option>
            <option value="bread">Bread</option>
            <option value="fluid">Fluid</option>
            <option value="congee">Congee</option>
            <option value="burger">Burger</option>
            <option value="fries">Fries</option>
            <option value="dessert">Dessert</option>
            <option value="sushi">Sushi</option>
            <option value="salad">Salad</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="price">Price:</label>
          <input type="number" name="price" value={food.price} onChange={handleFieldChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="description">Description:</label>
          <textarea name="description" value={food.description} onChange={handleFieldChange} required />
        </div>

        <div className="form-row">
          <label >Class:</label>
          <div className="radio-group-class">
          <label htmlFor="class1"><input type="checkbox" name="class1" value="1"  onChange={handleFieldChange}/> Grains</label>
          <label htmlFor="class2"><input type="checkbox" name="class2" value="2"  onChange={handleFieldChange}/> Vegetables</label>
          <label htmlFor="class3"><input type="checkbox" name="class3" value="3"  onChange={handleFieldChange}/> Fruits</label>
          <label htmlFor="class4"><input type="checkbox" name="class4" value="4"  onChange={handleFieldChange}/> Meat, fish, egg and alternatives</label>
          <label htmlFor="class5"><input type="checkbox" name="class5" value="5"  onChange={handleFieldChange}/> Milk and alternatives</label>
          <label htmlFor="class6"><input type="checkbox" name="class6" value="6"  onChange={handleFieldChange}/> Food and drinks with high Fat/ oil, salt and sugar</label>
          </div>
        </div>


        <div className="form-row">
          <label htmlFor="style">Style:</label>
          <select name="style" value={food.style} onChange={handleFieldChange} required>
            <option value="">Select style...</option>
            <option value="chinese">Chinese</option>
            <option value="western">Western</option>
            <option value="HK">HK</option>
            <option value="japan">Japan</option>
            <option value="korean">Korean</option>
            <option value="tai">Tai</option>
            <option value="indian">Indian</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="health">Health:</label>
          <select name="health" value={food.health} onChange={handleFieldChange} required>
            <option value="">Select health...</option>
            <option value="low-fat">Low-fat</option>
            <option value="low-sugar">Low-sugar</option>
            <option value="organic">Organic</option>
            <option value="gluten-free">Gluten-free</option>
            <option value="vegan">Vegan</option>
            <option value="non-fried">Non-fried</option>
            <option value="low-sodium">Low-sodium</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="set">Set:</label>
          <div className="radio-group">
            <label htmlFor="set-yes">
              <input type="radio" name="set" value="yes" checked={food.set === 'yes'} onChange={handleFieldChange} required />
              Yes
            </label>
            <label htmlFor="set-no">
              <input type="radio" name="set" value="no" checked={food.set === 'no'} onChange={handleFieldChange} required />
              No
            </label>
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="drink">Drink:</label>
          <div className="radio-group">
            <label htmlFor="drink-yes">
              <input type="radio" name="drink" value="yes" checked={food.drink === 'yes'} onChange={handleFieldChange} required />
              Yes
            </label>
            <label htmlFor="drink-no">
              <input type="radio" name="drink" value="no" checked={food.drink === 'no'} onChange={handleFieldChange} required />
              No
            </label>
          </div>
        </div>

        <button type="submit">Add Food</button>
      </form>
    </div>
  );
}



function Delete(props) {
  /*const [foods, setFoods] = useState([
    { id: 1, name: 'Pizza' },
    { id: 2, name: 'Burger' },
    { id: 3, name: 'Salad' },
    { id: 4, name: 'Pasta' },
  ]);*/
  const [foods, setFoods] = useState(props.deleteData);

  const [searchTerm, setSearchTerm] = useState('');

  // Handle change event when the search field is changed
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle click event when the delete button is clicked
  const handleDeleteClick = (foodid) => {
    //setFoods(foods.filter((f) => f.id !== food.id));
    var log=false;
    var reply = window.confirm('Comfirm to delete?')
    if (reply){
      log=true;
    }
    if(log){
      $.ajax({
        type: 'DELETE',
        url: 'https://sdp2023-dbapi.herokuapp.com/deletefood/'+foodid,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},   
        xhrFields: { withCredentials: true },
        withCredentials: 'include',
        crossDomain: true,
        success: function(response) {
          console.log(response);
          props.reSet(null);
          props.reload(props.index); 
        },
        error: function(error) {
          console.error(error);
        }
      });
    }
  };
  console.log(foods);
  // Filter the foods based on the search term
  if(foods.length != 0){
    const filteredFoods = foods.filter((food) => {
      return food.foodName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <div className="Delete">
        <header>
          <div className="search-field">
            <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
          </div>
          <button onClick={() => setSearchTerm('')}>Clear</button>
        </header>
        <ul className="food-list">
          {filteredFoods.map((food) => (
            <li key={food._id}>
              {food.foodName}
              <button onClick={() => handleDeleteClick(food._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }else{
    return (
      <>
        <h3>No food in the menu!</h3>
      </>
    )

  }
}

  
    


export default App;
