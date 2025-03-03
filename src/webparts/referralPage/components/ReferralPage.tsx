import * as React from "react";

import type { IReferralPageProps } from "./IReferralPageProps";
import Tenstack from "./Tenstack";
//  import StudentReferral from './StudentReferral';
//import StudentReferralten from './StudentReferralten';

export default class ReferralPage extends React.Component<IReferralPageProps> {
  public render(): React.ReactElement<IReferralPageProps> {
    return (
      <>
        {/* <StudentReferral/> */}
        {/* <StudentReferralten/> */}
        <Tenstack props={this.props} />
      </>
    );
  }
}
