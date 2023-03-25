// Copyright by LunaSec (owned by Refinery Labs, Inc)
//
// Licensed under the Business Source License v1.1
// (the "License"); you may not use this file except in compliance with the
// License. You may obtain a copy of the License at
//
// https://github.com/lunasec-io/lunasec/blob/master/licenses/BSL-LunaTrace.txt
//
// See the License for the specific language governing permissions and
// limitations under the License.
package scrape

import (
	"errors"

	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

type ProxyConfig struct {
	Host     string `yaml:"host"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
}

type Config struct {
	BrowserDomains string      `yaml:"browser_domains"`
	Workers        int         `yaml:"workers"`
	Proxy          ProxyConfig `yaml:"proxy"`
}

func NewConfig(provider config.Provider) (config Config, err error) {
	value := provider.Get("scrape")

	config.BrowserDomains = ""
	config.Workers = 1

	err = value.Populate(&config)
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable populate acron config")
		return
	}

	if config.Proxy.Host != "" && (config.Proxy.Username == "" || config.Proxy.Password == "") {
		return config, errors.New("proxy username and password must be set if proxy host is set")
	}

	return
}
