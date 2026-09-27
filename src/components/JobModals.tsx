import UbiikModal from "./modals/UbiikModal";
import FleetpinModal from "./modals/FleetpinModal";
import TutorModal from "./modals/TutorModal";
import ISAModal from "./modals/ISAModal";
import PizzaHutModal from "./modals/PizzaHutModal";
import PakNSaveModal from "./modals/PakNSaveModal";
import SaketModal from "./modals/SaketModal";

/** All job detail modals, targeted by data-bs-target="#<id>" */
const JobModals = () => (
  <>
    <UbiikModal /><FleetpinModal /><TutorModal />
    <ISAModal /><PizzaHutModal /><PakNSaveModal /><SaketModal />
  </>
);

export default JobModals;
