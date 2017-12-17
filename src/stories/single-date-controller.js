import { storiesOf } from "storybook-vue";
import SingleDateController from "./single-date-control-wrapper";

import { VERTICAL_ORIENTATION, VERTICAL_SCROLLABLE } from "../constants";

storiesOf("SingleDateController", module)
  .add("default", () => ({
    render() {
      return <SingleDateController />;
    }
  }))
  .add("with info panel", () => ({
    render() {
      return (
        <SingleDateController>
          <div
            style={{
              padding: "10px 21px",
              borderTop: "1px solid #dce0e0",
              color: "#484848"
            }}
            slot="info-panel"
          >
            &#x2755; Some useful info here
          </div>
        </SingleDateController>
      );
    }
  }))
  .add("with no animation", () => ({
    render() {
      return <SingleDateController transitionDuration={0} />;
    }
  }));
