import {CircularProgress, Stack} from "@mui/material";

export const Loader = ()=> {
    return (<Stack alignItems="center" marginTop={10} height={50}>
            <CircularProgress data-testid="loader" style={{ height: 50 }} />
        </Stack>
    )
}