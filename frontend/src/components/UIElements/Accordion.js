import { Accordion, AccordionTab } from "primereact/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

function HowItWorks({ children }) {
    return (
        <Accordion activeIndex={1}>
            <AccordionTab
                header={
                    <div className="text-dark">
                        <u>How It Works</u>
                        <FontAwesomeIcon icon={faQuestionCircle} className="acc-icon" />
                    </div>
                }
                className="acc-bg"
            >
                {children}
            </AccordionTab>
        </Accordion>
    )
}

export default HowItWorks;