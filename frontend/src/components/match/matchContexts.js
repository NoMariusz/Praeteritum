import React from "react";

export const PlayerIndexContext = React.createContext(-1);
export const SelectedElementContext = React.createContext({
    selectedElement: null,
    setSelectedElement: () => {},
});
