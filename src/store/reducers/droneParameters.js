let initialState = [
  {
    // name: languageSettingVal === "English" ? "Area" : "Укр2",
    name: "Час польоту",
    val: 49,
    icon: "coffee",
    measuredIn: "acres"
  },
  {
    // name: languageSettingVal === "English" ? "Battery" : "Укр3",
    name: "Заряд дрона",
    val: 3900,
    icon: "coffee",
    measuredIn: "mph"
  }
];

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_DRONE_PARAMETER":
      let changedArr = [...state];
      let toBeChangedIdx = changedArr.findIndex(
        el => el.name === action.keyVal.name
      );
      console.log("changedArr :", changedArr);
      console.log("toBeChangedIdx :", toBeChangedIdx);
      console.log("action.keyVal :", action.keyVal);
      // changedArr[toBeChangedIdx] = action.changedArr;
      changedArr[toBeChangedIdx].name = action.keyVal.name;
      changedArr[toBeChangedIdx].val = action.keyVal.val;
      return [...changedArr];
    default:
      return state;
  }
};

export default photoReducer;
