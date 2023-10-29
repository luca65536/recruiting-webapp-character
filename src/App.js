import { useEffect, useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";

function App() {
  // Helper functions to initialize states
  // NOTE: I did not take performance and readability that much into account when writing these functions due to the time constraint
  // TODO: move these helper functions to a new file
  const getAttributesObject = (attributeList) => {
    const attributesObject = {};
    attributeList.forEach((attributeName) => {
      attributesObject[attributeName] = 0;
    });
    return attributesObject;
  };

  const getAttributeModifiersObject = () => {
    const attributeModifiersObject = {};
    ATTRIBUTE_LIST.forEach((attributeName) => {
      attributeModifiersObject[attributeName] =
        Math.floor(attributes[attributeName] / 2) - 5;
    });
    return attributeModifiersObject;
  };

  const meetsClassRequirements = (className) => {
    return Object.keys(CLASS_LIST[className]).every((attributeName) => {
      return attributes[attributeName] >= CLASS_LIST[className][attributeName];
    });
  };

  const getClassAvailabilityObject = () => {
    const classAvailabilityObject = {};
    Object.keys(CLASS_LIST).forEach((className) => {
      classAvailabilityObject[className] = meetsClassRequirements(className);
    });
    return classAvailabilityObject;
  };

  const getClassNames = () => {
    const classNames = {};
    Object.keys(CLASS_LIST).forEach((className) => {
      classNames[className] = false;
    });
    return classNames;
  };

  const getSkillPointsDistributionObject = () => {
    const skillPointsDistributionObject = {
      available: 10 + 4 * attributeModifiers["Intelligence"],
    };
    SKILL_LIST.forEach((skill) => {
      const skillName = skill.name;
      skillPointsDistributionObject[skillName] = 0;
    });
    return skillPointsDistributionObject;
  };

  const getSkillValuesObject = () => {
    const skillValuesObject = {};
    SKILL_LIST.forEach((skill) => {
      const skillName = skill.name;
      skillValuesObject[skillName] =
        skillPointsDistribution[skillName] +
        attributeModifiers[skill.attributeModifier];
    });
    return skillValuesObject;
  };

  // State initialization
  const [attributes, setAttributes] = useState({
    ...getAttributesObject(ATTRIBUTE_LIST),
  });

  const [attributeModifiers, setAttributeModifiers] = useState({
    ...getAttributeModifiersObject(),
  });

  const [classAvailability, setClassAvailability] = useState({
    ...getClassAvailabilityObject(),
  });

  const [displayClassRequirementsToggle, setDisplayClassRequirementsToggle] =
    useState({
      ...getClassNames(),
    });

  const [skillPointsDistribution, setSkillPointsDistribution] = useState({
    ...getSkillPointsDistributionObject(),
  });

  const [skillValues, setSkillValues] = useState({
    ...getSkillValuesObject(),
  });

  // Helper functions to update states
  const updateAvailableSkillPoints = () => {
    setSkillPointsDistribution({
      ...skillPointsDistribution,
      available: 10 + 4 * attributeModifiers["Intelligence"],
    });
  };

  const increaseAttribute = (attributeName) => {
    setAttributes({
      ...attributes,
      [attributeName]: attributes[attributeName] + 1,
    });
  };

  // TODO: merge this with increaseAttribute
  const decreaseAttribute = (attributeName) => {
    if (attributes[attributeName] > 0) {
      setAttributes({
        ...attributes,
        [attributeName]: attributes[attributeName] - 1,
      });
    }
  };

  const increaseSkillPoints = (skillName) => {
    setSkillPointsDistribution({
      ...skillPointsDistribution,
      [skillName]: skillPointsDistribution[skillName] + 1,
    });
  };

  // TODO: merge this with increaseSkillPoints
  const decreaseSkillPoints = (skillName) => {
    if (skillPointsDistribution[skillName] > 0) {
      setSkillPointsDistribution({
        ...skillPointsDistribution,
        [skillName]: skillPointsDistribution[skillName] - 1,
      });
    }
  };

  // UseEffect hooks to update states when dependencies change
  useEffect(() => {
    setClassAvailability({ ...getClassAvailabilityObject() });
    setAttributeModifiers({ ...getAttributeModifiersObject() });
    updateAvailableSkillPoints();
    setSkillValues({ ...getSkillValuesObject() });
  }, [attributes]);

  useEffect(() => {
    setSkillValues({ ...getSkillValuesObject() });
  }, [skillPointsDistribution]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Luca Pietro</h1>
      </header>
      <section className="App-section">
        {/* TODO: move this section to a new component */}
        <section className="attribute-list">
          <h2>Attributes</h2>
          <div>
            <ul>
              {ATTRIBUTE_LIST.map((attributeName) => (
                <li key={attributeName}>
                  {attributeName}: {attributes[attributeName]}
                  (Modifier: {attributeModifiers[attributeName]})
                  <button onClick={() => increaseAttribute(attributeName)}>
                    +
                  </button>
                  <button onClick={() => decreaseAttribute(attributeName)}>
                    -
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* TODO: move this section to a new component */}
        <section className="class-list">
          <h2>Classes</h2>
          <div>
            <ul>
              {Object.keys(CLASS_LIST).map((className) => (
                <li
                  key={className}
                  style={
                    classAvailability[className]
                      ? { color: "green" }
                      : { color: "red" }
                  }
                  onClick={() =>
                    setDisplayClassRequirementsToggle({
                      ...displayClassRequirementsToggle,
                      [className]: !displayClassRequirementsToggle[className],
                    })
                  }
                >
                  {className}
                  {displayClassRequirementsToggle[className] && (
                    <div>
                      <ul>
                        {Object.keys(CLASS_LIST[className]).map(
                          (attributeName) => (
                            <li key={attributeName}>
                              {attributeName}:{" "}
                              {CLASS_LIST[className][attributeName]}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* TODO: move this section to a new component */}
        <section className="skill-list">
          <h2>Skills</h2>
          <div>
            <ul>
              {SKILL_LIST.map((skill) => {
                const skillName = skill.name;
                return (
                  <li key={skillName}>
                    {skillName} - points: {skillPointsDistribution[skillName]}{" "}
                    <button onClick={() => increaseSkillPoints(skillName)}>
                      +
                    </button>
                    <button onClick={() => decreaseSkillPoints(skillName)}>
                      -
                    </button>{" "}
                    modifier ({skill.attributeModifier}):{" "}
                    {attributeModifiers[skill.attributeModifier]} total:{" "}
                    {skillValues[skillName]}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
}

export default App;
