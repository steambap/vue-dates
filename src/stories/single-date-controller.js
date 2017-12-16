import { storiesOf } from "storybook-vue";
import SingleDateController from "./single-date-control-wrapper";

import { VERTICAL_ORIENTATION, VERTICAL_SCROLLABLE } from "../constants";

storiesOf("SingleDateController", module)
  .add("default", () => ({
    render() {
      return <SingleDateController />;
    }
  }))
  .add("with no animation", () => ({
    render() {
      return <SingleDateController transitionDuration={0} />;
    }
  }));
