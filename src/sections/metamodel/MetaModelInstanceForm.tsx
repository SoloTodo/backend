import { capitalize, Grid, Stack, Typography } from "@mui/material";
import {
  InstanceMetaField,
  MetaField,
  MetaModel,
} from "src/frontend-utils/types/metamodel";
import InstanceInput from "./InstanceInput";

export default function MetaModelInstanceForm({
  metaModel,
}: {
  metaModel: MetaModel;
}) {
  return (
    <Stack spacing={3}>
      {metaModel.fields?.map((f, index) => (
        <Grid key={index} container alignItems="center">
          <Grid key={`name-${index}`} item xs={4}>
            <Typography fontWeight={500}>{capitalize(f.name)}</Typography>
            {/* add help text as secondary text */}
          </Grid>
          <Grid key={`field-${index}`} item xs={8}>
            <InstanceInput metaField={f} />
          </Grid>
        </Grid>
      ))}
    </Stack>
  );
}
