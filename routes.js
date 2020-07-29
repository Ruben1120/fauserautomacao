import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Inicio from "./src/components/Inicio";
import Lampada from "./src/components/Lampada";
import Torneira from "./src/components/Torneira";
import MudarIP from "./src/components/MudarIP";
const Route = createStackNavigator({
    Inicio,
    Lampada,
    Torneira,
    MudarIP,
});
  
export default createAppContainer(Route);