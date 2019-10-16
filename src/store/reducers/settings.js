let initialState = {
  settings: [
    {
      label: "Language",
      value: "Ukrainian",
      type: "select",
    },
    {
      label: "shit",
      value: true,
      type: "checkbox",
    },
  ]
};

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SETTING_STATE":
      let bufSettings = [...state.settings];
      bufSettings[action.settingState.name] = action.settingState.value;
      return {
        ...state,
        settings: [bufSettings],
      };
    default:
      return state;
  }
};

export default photoReducer;
