# Copyright (c) 2011, Yahoo! Inc.  All rights reserved.
# Copyright (c) 2013, Salesforce.com  All rights reserved.
# Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.

#Update each time the code changes.
VERSION := 1.00.00
DATE := $(shell date +%s)

PROD_DIRECTORY := prod-$(VERSION)-$(DATE)

PLUGINS := src/plugins/rt.js src/plugins/memory.js src/plugins/mobile.js src/plugins/rtrestiming.js src/plugins/kylie.js

SHIM := src/shim/perfEnums.js src/shim/perfShimClousreCompilerTypes.js src/shim/perfShim.js

STUB := src/shim/perfEnums.js src/shim/perfShimClousreCompilerTypes.js src/shim/perfStubs.js

BEACON_URL := ""
ROOT_NAMESPACE := "Perf"
IMPLEMENTATION_FILE_NAME := perf
STUB_FILE_NAME := perfStub

MAP_FILE_NAME := "$(IMPLEMENTATION_FILE_NAME).js.map"

MINIFIER := java -jar ClosureCompiler/compiler.jar --define="VERSION='$(VERSION)'" --define="BEACON_URL='$(BEACON_URL)'" --define="ROOT_NAMESPACE='$(ROOT_NAMESPACE)'" --summary_detail_level 3 --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS --language_in ECMASCRIPT5_STRICT --output_wrapper 'this[$(ROOT_NAMESPACE)]&&void 0!==this[$(ROOT_NAMESPACE)].enabled||(function(window){%output%})(this);' --create_source_map ./$(PROD_DIRECTORY)/$(MAP_FILE_NAME) --source_map_format=V3 --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error internetExplorerChecks --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_error nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --js=

MINIFIER_STUBS := java -jar ClosureCompiler/compiler.jar --define="ROOT_NAMESPACE='$(ROOT_NAMESPACE)'" --summary_detail_level 3 --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS --language_in ECMASCRIPT5_STRICT --output_wrapper 'this[$(ROOT_NAMESPACE)]&&void 0!==this[$(ROOT_NAMESPACE)].enabled||(function(window){%output%})(this);' --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error internetExplorerChecks --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_error nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --js=

MINIFIER_DEBUG := java -jar ClosureCompiler/compiler.jar --define="VERSION='$(VERSION)'" --define="BEACON_URL='$(BEACON_URL)'" --define="ROOT_NAMESPACE='$(ROOT_NAMESPACE)'" --summary_detail_level 3 --warning_level VERBOSE --compilation_level WHITESPACE_ONLY --formatting PRETTY_PRINT --language_in ECMASCRIPT5_STRICT --output_wrapper "this.$(ROOT_NAMESPACE)&&void 0!==this.$(ROOT_NAMESPACE).enabled||(function(window){%output%})(this);" --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error internetExplorerChecks --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_error nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --js=

all: $(PROD_DIRECTORY)/$(IMPLEMENTATION_FILE_NAME).js

usage:
	echo "Create a release version of Kylie:"
	echo "	make"
	echo ""
	echo "Create a release version of Kylie with the rt, bw, dns, & kylie plugins:"
	echo "	make PLUGINS=\"plugins/rt.js plugins/bw.js plugins/dns.js plugins/kylie.js\""
	echo ""
	echo "Create a release version of Kylie with a custom beacon URL and root namespace:"
	echo "	make BEACON_URL=\"/location/to/beacon/data/to\" ROOT_NAMESPACE=\"Ninja\""
	echo ""
	echo "All of the major make arguments (all of which are optional)"
	echo " BEACON_URL : The url where the collected data will be sent. By default it will use \"\"."
	echo " ROOT_NAMESPACE : The name of the JavaScript object to which Kylie will be accessible from in the browser. Can be used to prevent name collisions. By default it will use \"Perf\"."
	echo " IMPLEMENTATION_FILE_NAME : When building code this is the name of the resulting JS file, excluding the extension. By default it will use \"perf\"."
	echo " STUB_FILE_NAME : The name of the no-op stub file, excluding the extension. By default it will use \"perfStub\"."
	echo ""

$(PROD_DIRECTORY)/$(IMPLEMENTATION_FILE_NAME).js: $(PROD_DIRECTORY)/$(IMPLEMENTATION_FILE_NAME)-debug.js
	echo "Making $@ ..."
	echo "using plugins: $(PLUGINS)..."
	echo "using shim: $(SHIM)..."
	$(MINIFIER)src/boomerangClousreCompilerTypes.js src/plugins/pluginClousreCompilerTypes.js src/boomerang.js $(PLUGINS) $(SHIM) --js_output_file=$@
	#Steps to connect the js file to the map file and handle some security
	echo "//# sourceMappingURL=$(MAP_FILE_NAME)" >> $@
	echo ")]}" | cat - $(PROD_DIRECTORY)/$(MAP_FILE_NAME) > /tmp/$(MAP_FILE_NAME).tmp && mv /tmp/$(MAP_FILE_NAME).tmp $(PROD_DIRECTORY)/$(MAP_FILE_NAME)
	sed -i "" "s|$(PROD_DIRECTORY)/$(IMPLEMENTATION_FILE_NAME)|$(IMPLEMENTATION_FILE_NAME)|g" $(PROD_DIRECTORY)/$(MAP_FILE_NAME) 
	echo "done"
	echo

$(PROD_DIRECTORY)/$(IMPLEMENTATION_FILE_NAME)-debug.js: $(PROD_DIRECTORY)/$(STUB_FILE_NAME).js
	echo "Making $@ ..."
	echo "using plugins: $(PLUGINS)..."
	echo "using shim: $(SHIM)..."
	$(MINIFIER_DEBUG)src/boomerangClousreCompilerTypes.js src/plugins/pluginClousreCompilerTypes.js src/boomerang.js $(PLUGINS) $(SHIM) --js_output_file=$@
	echo "done"
	echo

$(PROD_DIRECTORY)/$(STUB_FILE_NAME).js: makeProdDir
	echo
	echo "Making $@ ..."
	echo "using stub: $(STUB)..."
	$(MINIFIER_STUBS)$(STUB) > $@
	echo "done"
	echo

makeProdDir: 
	echo
	echo "Making $(PROD_DIRECTORY) ..."
	mkdir $(PROD_DIRECTORY)
	echo "done"
	echo

.PHONY: all
.SILENT: