function HeaderTabs({ selectedTab, handleTabClick }) {
    return (
        <div className="">
            <div className="btn-group">
                <button
                    type="button"
                    className={`btn header-tab ${selectedTab === "All Source" ? "active-head" : ""
                        }`}
                    onClick={() => handleTabClick("All Source")}
                >
                    All
                </button>
                <button
                    type="button"
                    className={`btn header-tab ${selectedTab === "Official" ? "active-head" : ""
                        }`}
                    onClick={() => handleTabClick("Official")}
                >
                    Official
                </button>
                <button
                    type="button"
                    className={`btn header-tab ${selectedTab === "Custom" ? "active-head" : ""
                        }`}
                    onClick={() => handleTabClick("Custom")}
                >
                    Custom
                </button>
            </div>
        </div>
    )
}

export default HeaderTabs