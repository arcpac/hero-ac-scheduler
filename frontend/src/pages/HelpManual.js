import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Accordion, AccordionTab } from "primereact/accordion";
import faqAM from "../components/UIElements/HelpManual/faq.js";
import "../styles/HelpManual.css";

const HelpManual = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [filteredParagraphs, setFilteredParagraphs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSearch = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);
    setSelectedParagraph(null);
    setActiveIndex(null);

    if (searchText.trim() === "") {
      setFilteredParagraphs([]);
    } else {
      const matchingParagraphs = faqAM.filter((paragraph) =>
        paragraph.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredParagraphs(matchingParagraphs);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSelectedParagraph(null);
    setFilteredParagraphs([]);
  };

  const handleParagraphClick = (id) => {
    const selectedParagraphIndex = faqAM.findIndex(
      (paragraph) => paragraph.id === id
    );
    setSelectedParagraph(selectedParagraphIndex);
    setActiveIndex(selectedParagraphIndex);
  };

  useEffect(() => {
    document.title = "Help Manual - Airconnect";
  }, []);
  const paragraphs = filteredParagraphs.length > 0 ? filteredParagraphs : faqAM;

  const renderContent = () => {
    if (selectedParagraph !== null) {
      const paragraph = faqAM[selectedParagraph];
      return (
        <div className="pr-4">
          <h3 className="text-secondary mb-4">{paragraph.title}</h3>
          {paragraph.photoUrl && (
            <img src={paragraph.photoUrl} alt={`Photo ${paragraph.id}`} />
          )}
          <div
            className="text-medium lss-wider"
            dangerouslySetInnerHTML={{ __html: paragraph.divContent }}
          />
        </div>
      );
    } else if (filteredParagraphs.length > 0) {
      return (
        <div>
          {filteredParagraphs.map((matchedParagraph) => (
            <div key={matchedParagraph.id} className="pr-4">
              <h4
                className="text-secondary mb-2 faq"
                onClick={() => handleParagraphClick(matchedParagraph.id)}
              >
                <ChevronRightIcon />
                {matchedParagraph.title}
              </h4>
              {matchedParagraph.photoUrl && (
                <img
                  src={matchedParagraph.photoUrl}
                  alt={`Photo ${matchedParagraph.id}`}
                />
              )}
              {selectedParagraph === matchedParagraph.id - 1 && (
                <div
                  className="text-medium lss-wider"
                  dangerouslySetInnerHTML={{
                    __html: matchedParagraph.divContent,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      );
    } else if (searchText.trim() !== "" && filteredParagraphs.length === 0) {
      return (
        <div>{`Your search for "${searchText}" returned 0 result(s).`}</div>
      );
    }

    return <div>Select an article to view its content.</div>;
  };

  const categories = Array.from(new Set(faqAM.map((item) => item.category)));

  return (
    <div className="help-moderator-container my-4">
      <div className="search-container">
        <h2>What are you looking for?</h2>
        <TextField
          type="text"
          placeholder="Search for keywords"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "70%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <ClearIcon
                  onClick={handleClearSearch}
                  style={{ cursor: "pointer" }}
                />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <hr className="my-5"/>
      <div className="d-flex justify-content-between align-items-top m-3">
        <div className="accordion-container col-md-3">
          <Accordion
            multiple={false}
            activeIndex={activeIndex}
          >
            {categories.map((category) => (
              <AccordionTab key={category} header={category} className="small">
                <div>
                  {paragraphs
                    .filter((item) => item.category === category)
                    .map((paragraph) => (
                      <p
                        key={paragraph.id}
                        className={`py-2 border-bottom faq ${
                          selectedParagraph === paragraph.id - 1
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleParagraphClick(paragraph.id)}
                      >
                        {paragraph.title}
                      </p>
                    ))}
                </div>
              </AccordionTab>
            ))}
          </Accordion>
        </div>

        <div className="col-md-9 text-dark mx-4">
          <div className="content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default HelpManual;
