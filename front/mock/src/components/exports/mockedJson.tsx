

/**
 * mockedJson class is our mocked data for server, we have the 
 * 3 mocked server commands, loadcsv, viewcsv, and searchcsv
 * along with datasets to mock the results from these server 
 * commands.
 */

//csvfile to mock view load functionality
let CSVfile: string[][] = [];
//file to ensure access to different csv data
let file: string;
//contain the mocked search output data
let searchOutput: string[][] = [];

function setCSVFile(newCSVfile: string[][]) {
  CSVfile = newCSVfile;
}
function setSearchOutput(newsearchOutput: string[][]) {
  searchOutput = newsearchOutput;
}
function setFile(filename: string) {
  file = filename;
}

export const stateToBroadband: Map<string, string[][]> = new Map([
  [
    "Illinois",
    [
      ["Kankakee County, Illinois: 83.1"],
      ["Cook County, Illinois: 84.8"],
      ["Lake County, Illinois: 90.2"],
      ["Tazewell County, Illinois: 82.4"],
    ],
  ],
  [
    "Rhode Island",
    [
      ["Providence County, Rhode Island: 85.4"],
      ["Kent County, Rhode Island: 84.1"],
      ["Newport County, Rhode Island: 90.1"],
      ["Washington County, Rhode Island: 92.8"],
    ],
  ],
  ['Illinois "Cook County"', [["Cook County, Illinois", ": 84.8"]]],
  ["FakeState", [["error_bad_request,FakeState is not a valid state"]]],
]);

export const CSVsearchStardataToDataMap: Map<string, string[][]> = new Map([
  //Col: planet, query pluto
  ["Planet, Pluto", [["Pluto", "Tiny", "White"]]],
  //query pluto
  ["Pluto", [["Pluto", "Tiny", "White"]]],
  //query huge, testing 2 row output
  [
    "Huge",
    [
      ["Saturn", "Huge", "Yellow"],
      ["Jupiter", "Huge", "Red"],
    ],
  ],
]);

export const CSVsearchEducationToDataMap: Map<string, string[][]> = new Map([
  //query Brown, test query
  ["Brown", [
    ["White", "2000", "Brown", "Female"],
    ["White", "2000", "Brown", "Male"],
    ["Hispanic", "2001", "Brown", "Female"],
    ["Black", "2002", "Brown", "Female"],
    ["White", "2000", "Brown", "Female"],
  ]],
  //Column Year, query 2001, test col with query
  ["Year, 2001", [
    ["Hispanic", "2001", "Brown", "Female"],
    ["Asian", "2001", "Penn", "Female"],
  ]],

  //Col Race, query Male, test no results found
  ["Race, Male", [
    []
  ]],

  //Col index 0, query Asian,
  ["0, Asian", [ ["Asian", "2001", "Penn", "Female"],]],

  //query Hispanic
  ["Hispanic", [
    ["Hispanic", "2001", "Brown", "Female"],
    ["Hispanic", "2000", "Amherst", "Male"],
  ]]

    ]);

// extra test cases w different mocked data
export const CSVsearchIncomeToDataMap: Map<string, string[][]> = new Map([

  ["Year, 2000", [
    ["Asian", "2000", "67000"],
    ["African", "2000", "82800"],
    ["White", "2000", "87420"],
    ["Asian", "2000", "99110"],
]],

  ["67000", [["Asian", "2000", "67000"],
]],

  ["White",[
      ["White", "2000", "87420"],
  ]],
]);
// extra test cases w different mocked data
export const CSVsearchIncomeRiToDataMap: Map<string, string[][]> = new Map([
  ["Town, Providence", [
    ["Providence", "10"],
    ["North Providence", "100"],
  ]],
  ["Cranston", [
    ["Cranston", "88101"],
  ]]
]);
// map to determine if loaded a correct csv filepath
export const CSVfilepathToDataMap: Map<string, string[][]> = new Map([
  [
    "stardata.csv",
    [
      ["Planet", "Size", "Color"],
      ["Earth", "Medium", "Blue"],
      ["Pluto", "Tiny", "White"],
      ["Saturn", "Huge", "Yellow"],
      ["Jupiter", "Huge", "Red"],
      ["Mercury", "Small", "White"],
      ["Mars", "Medium", "Red"],
    ],
  ],
  [
    "postsecondary_education.csv",
    [
      ["Race", "Year", "School", "Sex"],
      ["White", "2000", "Brown", "Male"],
      ["Asian", "2000", "Penn", "Male"],
      ["Hispanic", "2001", "Brown", "Female"],
      ["Black", "2002", "Brown", "Female"],
      ["White", "2000", "Brown", "Female"],
      ["Hispanic", "2000", "Amherst", "Male"],
      ["White", "2002", "Amherst", "Male"],
      ["Asian", "2001", "Penn", "Female"],
      ["White", "2000", "Brown", "Female"],
      ["Asian", "2000", "Penn", "Male"],
    ],
  ],
  [
    "income_by_race_edited.csv",
    [
      ["Race", "Year", "Income"],
      ["Asian", "2000", "67000"],
      ["African", "2000", "82800"],
      ["White", "2000", "87420"],
      ["Asian", "2000", "99110"],
      ["Asian", "2001", "123400"],
      ["African", "2001", "912800"],
      ["Asian", "2001", "67000"],
      ["African", "2001", "12800"],
    ],
  ],
  [
    "ri_income",
    [
      ["Town", "Income"],
      ["Providence", "10"],
      ["North Providence", "100"],
      ["Cranston", "88101"],
      ["Barrington", "99323"],
      ["Hopkinton", "77859"]
    ],
  ],
]);

// mocked loadcsv loads to local var csvfile for view and load
// to error handle
export function loadcsv(commandString: string) {
  const data = CSVfilepathToDataMap.get(commandString);

  if (data !== undefined) {
    setFile(commandString);
    setCSVFile(data);
    return "successfully loaded " + commandString;
  } else {
    return " can not recognize the csv filepath " + commandString;
  }
}

// mocked view
export function viewcsv() {
  if (CSVfile.length !== 0) {
    return CSVfile;
  } else {
    return " csv file not loaded";
  }
}

// mocked search
export function searchcsv(column: string, value: string, hasHeader: string) {
  if (CSVfile.length !== 0) {
    let data = CSVsearchStardataToDataMap.get(value);
    if (column === "") {
      if (file === "stardata.csv") {
        data = CSVsearchStardataToDataMap.get(value);
      } else if (file === "postsecondary_education.csv") {
        data = CSVsearchEducationToDataMap.get(value);
      } else if (file === "income_by_race_edited.csv") {
        data = CSVsearchIncomeToDataMap.get(value);
      }
      if (data !== undefined) {
        setSearchOutput(data);
        return searchOutput;
      }
    } else {
      let data = CSVsearchStardataToDataMap.get(column + ", " + value);

      if (file === "stardata.csv") {
        data = CSVsearchStardataToDataMap.get(column + ", " + value);
      } else if (file === "postsecondary_education.csv") {
        data = CSVsearchEducationToDataMap.get(column + ", " + value);
      } else if (file === "income_by_race_edited.csv") {
        data = CSVsearchIncomeToDataMap.get(column + ", " + value);
      }
      if (data !== undefined) {
        setSearchOutput(data);
        return searchOutput;
      }
    }
    return "cannot find search query " + column + " " + value;
  } else {
    return "csv file not loaded";
  }
}

// mocked broadband
  export function broadband(state: string, county: string) {
    let data;
    if(county === "Cook County"){
      data = stateToBroadband.get('Illinois "Cook County"');
    }
    else if(county === "Cook"){
      data = "error_bad_request, Cook county does not exist";
    }
    else{
      data = stateToBroadband.get(state);
    }
    if(data === undefined){
      if(state === "Cook County"){
        data = "error_bad_request,Cook County is not a valid state"
      }
      else if (state === "FakeState") {
        data = "error_bad_request,FakeState is not a valid state";
      } else {
        data = "error_bad_request, Cook county does not exist";
      }
    }
    return data
  }
