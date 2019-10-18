// let initialState = {
//   settings: [
//     {
//       label: "Language",
//       value: "Ukrainian",
//       type: "select",
//     },
//     {
//       label: "shit",
//       value: true,
//       type: "checkbox",
//     },
//   ]
// };

// let photoReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "SET_SETTING_STATE":
//       let bufSettings = [...state.settings];
//       bufSettings[action.settingState.name] = action.settingState.value;
//       return {
//         ...state,
//         settings: [bufSettings],
//       };
//     default:
//       return state;
//   }
// };

// export default photoReducer;
let initialState = [
  {
    label: "Language",
    value: "Ukrainian",
    type: "select"
  },
  {
    label: "shit",
    value: true,
    type: "checkbox"
  }
];

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SETTING_STATE":
      return state.map((el, idx) => {
        if (el.label === action.settingState.label) {
          return {
            ...el,
            ...action.settingState
          };
        } else {
          return el;
        }
      });
    default:
      return state;
  }
};

export default photoReducer;
