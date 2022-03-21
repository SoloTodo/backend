import { ReactElement } from "react";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";


// ----------------------------------------------------------------------

UpdatePricing.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
  
  // ----------------------------------------------------------------------

export default function UpdatePricing() {
    return (
        <Page title="Actualizar Pricing">

        </Page>
    )
}