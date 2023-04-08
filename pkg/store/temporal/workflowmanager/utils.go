package workflowmanager

import (
	"errors"
	"regexp"
)

const (
	scheduleExpressionRegex = `^rate\((?P<value>\d+) (?P<unit>minutes|hours|days)\)$`
	cronRegex               = `^cron((?P<expr>.*))$`
)

/**
 * Parses url with the given regular expression and returns the
 * group values defined in the expression.
 *
 */
func getParams(regEx, url string) (paramsMap map[string]string) {

	compRegEx := regexp.MustCompile(regEx)
	match := compRegEx.FindStringSubmatch(url)

	paramsMap = make(map[string]string)
	for i, name := range compRegEx.SubexpNames() {
		if i > 0 && i <= len(match) {
			paramsMap[name] = match[i]
		}
	}
	return
}

func scheduleExpressionToCron(expr string) (string, error) {
	params := getParams(scheduleExpressionRegex, expr)
	if len(params) == 2 {
		value := params["value"]
		if "minutes" == params["unit"] {
			return "*/" + value + " * * * *", nil
		}
		if "hours" == params["unit"] {
			return "0 */" + value + " * * *", nil
		}
		if "days" == params["unit"] {
			return "0 0 */" + value + " * *", nil
		}
	}

	params = getParams(cronRegex, expr)
	if len(params) != 0 {
		return params["expr"], nil
	}
	return "", errors.New("expression is not a valid schedule")
}
