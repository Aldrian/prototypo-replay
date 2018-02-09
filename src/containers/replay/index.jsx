// @flow
import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import { animateChanges, animateChangesInfinite } from "../../data/font";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Button from "../../components/button";
import ContentEditable from "../../components/contentEditable/";
import "./Replay.css";

class Replay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalTime: 0.3,
      framesNumber: 10,
      word: "Hello Prototypo",
      displayTextColorPicker: false,
      displayBackgroundColorPicker: false,
      hideSettings: false,
      shouldLoop: false,
      textColor: {
        r: "0",
        g: "0",
        b: "0",
        a: "1"
      },
      backgroundColor: {
        r: "255",
        g: "255",
        b: "255",
        a: "1"
      },
      fontSize: 70
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleClick(picker) {
    switch (picker) {
      case "text":
        this.setState({
          displayTextColorPicker: !this.state.displayTextColorPicker
        });
        break;
      case "background":
        this.setState({
          displayBackgroundColorPicker: !this.state.displayBackgroundColorPicker
        });
        break;
      default:
        break;
    }
  }
  handleClose(picker) {
    switch (picker) {
      case "text":
        this.setState({
          displayTextColorPicker: !this.state.displayTextColorPicker
        });
        break;
      case "background":
        this.setState({
          displayBackgroundColorPicker: !this.state.displayBackgroundColorPicker
        });
        break;
      default:
        break;
    }
  }
  handleChange(color) {
    if (this.state.displayTextColorPicker) {
      this.setState({
        textColor: color.rgb
      });
    } else {
      this.setState({
        backgroundColor: color.rgb
      });
    }
  }
  render() {
    const styles = reactCSS({
      default: {
        textColor: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `rgba(${this.state.textColor.r}, ${
            this.state.textColor.g
          }, ${this.state.textColor.b}, ${this.state.textColor.a})`
        },
        backgroundColor: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `rgba(${this.state.backgroundColor.r}, ${
            this.state.backgroundColor.g
          }, ${this.state.backgroundColor.b}, ${this.state.backgroundColor.a})`
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxBackground: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });
    return (
      <div className="Replay">
        <div className="buttons">
          <Button
            label="Select another font"
            onClick={() => {
              this.props.selectAnotherFont();
            }}
          />
          <Button
            label="Animate changes"
            onClick={() => {
              this.state.shouldLoop
              ? this.props.animateChangesInfinite(this.state.intervalTime, this.state.framesNumber, this.state.word)
              : this.props.animateChanges(this.state.intervalTime, this.state.framesNumber, this.state.word);
            }}
          />
          <Button
            label={`${this.state.hideSettings ? 'Show settings' : 'Hide settings'}`}
            onClick={() => {
              this.setState({hideSettings: !this.state.hideSettings});
            }}
          />
        </div>
        <div
          className="settings container"
          style={{ display: this.state.hideSettings ? "none" : "block" }}
        >
          <h3>Style</h3>
          <hr />
          <div>
            Text color:
            <div
              style={styles.swatch}
              onClick={() => {
                this.handleClick("text");
              }}
            >
              <div style={styles.textColor} />
            </div>
            {this.state.displayTextColorPicker ? (
              <div style={styles.popover}>
                <div
                  style={styles.cover}
                  onClick={() => {
                    this.handleClose("text");
                  }}
                />
                <SketchPicker
                  color={this.state.textColor}
                  onChange={this.handleChange}
                />
              </div>
            ) : null}
          </div>
          <div>
            Background color:
            <div
              style={styles.swatch}
              onClick={() => {
                this.handleClick("background");
              }}
            >
              <div style={styles.backgroundColor} />
            </div>
            {this.state.displayBackgroundColorPicker ? (
              <div style={styles.popover}>
                <div
                  style={styles.cover}
                  onClick={() => {
                    this.handleClose("background");
                  }}
                />
                <SketchPicker
                  color={this.state.backgroundColor}
                  onChange={this.handleChange}
                />
              </div>
            ) : null}
          </div>
          <div>
            Font size :
            <InputRange
              maxValue={300}
              minValue={40}
              value={this.state.fontSize}
              onChange={fontSize => this.setState({ fontSize })}
            />
          </div>
          <hr />
          <h3>Animation</h3>
          <hr />
          <p>
            Time per param:{" "}
            <input
              type="number"
              placeholder="in s"
              value={this.state.intervalTime}
              onChange={e => this.setState({ intervalTime: e.target.value })}
            />
          </p>
          <p>
            Number of variations per param:{" "}
            <input
              type="number"
              placeholder="Frame number"
              value={this.state.framesNumber}
              onChange={e => this.setState({ framesNumber: e.target.value })}
            />
          </p>
          <p>
            Loop animation:{" "}
            <input
              type="checkbox"
              value={this.state.shouldLoop}
              onChange={e => this.setState({ shouldLoop: !this.state.shouldLoop })}
            />
          </p>
        </div>
        <div className="text"
          style={{
            background: `rgba(${this.state.backgroundColor.r}, ${
              this.state.backgroundColor.g
            }, ${this.state.backgroundColor.b}, ${this.state.backgroundColor.a})`,
            color: `rgba(${this.state.textColor.r}, ${
              this.state.textColor.g
            }, ${this.state.textColor.b}, ${this.state.textColor.a})`,
            fontSize: this.state.fontSize,
            textAlign: 'center',
          }}
        >
          <ContentEditable
            html={`<span>${this.state.word}</span>`}            
            onChange={event => {
              this.setState({
                word: event.target.value
                  .replace(/<\/?span[^>]*>/g, "")
                  .replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, "")
              });
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectAnotherFont: () => push("/selectFont"),
      animateChanges,
      animateChangesInfinite,
    },
    dispatch
  );

Replay.propTypes = {
  selectAnotherFont: PropTypes.func.isRequired,
  animateChanges: PropTypes.func.isRequired,
  animateChangesInfinite: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Replay));
