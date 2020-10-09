import React from 'react';
import PropTypes from 'prop-types';
import { RadioBtn, Aux } from '../../../Components';
import classes from '../create.css';

const Step2New = (props) => {
  const { ggb, setGgb } = props;
  return (
    <Aux>
      <p style={{ marginBottom: 10 }}>Select a workspace type</p>
      <div className={classes.RadioButtons}>
        <RadioBtn name="geogebra" checked={ggb} check={setGgb}>
          GeoGebra
        </RadioBtn>
        <RadioBtn name="desmos" checked={!ggb} check={setGgb}>
          Desmos
        </RadioBtn>
        <RadioBtn name="desmosActivity" checked={!ggb} check={setGgb}>
          Desmos Activity
        </RadioBtn>
      </div>
    </Aux>
  );
};

Step2New.propTypes = {
  ggb: PropTypes.bool.isRequired,
  setGgb: PropTypes.func.isRequired,
};

export default Step2New;
