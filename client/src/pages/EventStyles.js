import { makeStyles } from "@material-ui/core/styles";

const useEventStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
		},

		flexGrow: "1",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
		padding: "0 30px",
	},

	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
	},
}));

export default useEventStyles;
