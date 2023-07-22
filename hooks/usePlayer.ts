import { create } from "zustand"; //a state management library for React

//If the ? is not present, the property is considered "required," and it must have a value of the specified type. 
//In this case, if you remove the ? and define activeId: string, the activeId property becomes mandatory, 
//and you would be required to provide a valid string value when creating the PlayerStore.
//without providing an initial value for activeId, and it will be initialized as undefined.
//Later, you can set a value to activeId using the setId function defined in the PlayerStore.
 interface PlayerStore {
    ids: string[]; // An array of strings representing the IDs of the songs in the player.
    activeId?: string; //A string representing the ID of the currently active (playing) song.
    setId: (id:string) => void; //A function that takes a string id as an argument and sets the activeId to the provided id
    setIds: (ids: string[]) => void; //A function that takes an array of strings ids as an argument and sets the ids array to the provided ids.
    reset: () => void; //A function that resets the player state by clearing the ids array and setting activeId to undefined.
 }

 const usePlayer = create<PlayerStore>((set) => ({
    // the initial state of the player store is defined using an object with ids and activeId properties 
    //set to their initial values (ids: [] and activeId: undefined).
    ids: [],
    activeId: undefined,
    //The setId, setIds, and reset actions are defined as functions that update the state using the set function from zustand.
    setId: (id: string) => set({ activeId: id}),
    setIds: (ids: string[]) => set({ ids: ids }), //Function implementation to update the ids property
    reset: () => set({ ids: [], activeId: undefined})
 }))

 export default usePlayer;