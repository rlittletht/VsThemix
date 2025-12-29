# Agent instructions

This project builds a typescript program that performs various operations for visual studio themes

# Compile operation

The compile operation (which is the default) will read a JSON theme definition and compile it into a vsix suitable for installing with Visual Studio.

## VSIX file structure

VSIX files are packages that conform to the Open Packaging Conventions. These packages are stored using a zip container

There are several parts that are added to the package:

### catalog.json

this JSON file is defined by the interfaces defined in src/vstheme/catalog.ts

### extension.vsixmanifest

this XML file has the following structure:
    <?xml version="1.0" encoding="utf-8"?>
    <PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
    <Metadata>
        <Identity Version="1.0.0" Language="en-US" Publisher="${IThemeDefinition.author}" Id="${IThemeDefinition.extensionIdentity}" />
        <DisplayName>${IThemeDefinition.name}</DisplayName>
        <Description xml:space="preserve">
        ${"description of theme"}
        </Description>
    </Metadata>
    <Installation>
        <InstallationTarget Id="Microsoft.VisualStudio.Community" Version="[${IThemeDefinition.vsTargetMin || 18.0},${IThemeDefinition.vsTargetMax || 19.0})" >
        <ProductArchitecture>amd64</ProductArchitecture>
        </InstallationTarget>
        <InstallationTarget Id="Microsoft.VisualStudio.Community" Version="[${IThemeDefinition.vsTargetMin || 18.0},${IThemeDefinition.vsTargetMax || 19.0})" >
        <ProductArchitecture>arm64</ProductArchitecture>
        </InstallationTarget>
        <InstallationTarget Id="Microsoft.VisualStudio.Enterprise" Version="[${IThemeDefinition.vsTargetMin || 18.0},${IThemeDefinition.vsTargetMax || 19.0})" >
        <ProductArchitecture>amd64</ProductArchitecture>
        </InstallationTarget>
        <InstallationTarget Id="Microsoft.VisualStudio.Enterprise" Version="[${IThemeDefinition.vsTargetMin || 18.0},${IThemeDefinition.vsTargetMax || 19.0})" >
        <ProductArchitecture>arm64</ProductArchitecture>
        </InstallationTarget>
        <InstallationTarget Id="Microsoft.VisualStudio.Pro" Version="[${IThemeDefinition.vsTargetMin || 18.0},${IThemeDefinition.vsTargetMax || 19.0})" >
        <ProductArchitecture>amd64</ProductArchitecture>
        </InstallationTarget>
        <InstallationTarget Id="Microsoft.VisualStudio.Pro" Version="[${IThemeDefinition.vsTargetMin || 18.0},${IThemeDefinition.vsTargetMax || 19.0})" >
        <ProductArchitecture>arm64</ProductArchitecture>
        </InstallationTarget>
    </Installation>
    <Dependencies>
        <Dependency Id="Microsoft.Framework.NDP" DisplayName="Microsoft .NET Framework" Version="[4.5,)" />
    </Dependencies>
    <Prerequisites>
        <Prerequisite Id="Microsoft.VisualStudio.Component.CoreEditor" Version="[${IThemeDefinition.vsTargetMin || 18.0},${IThemeDefinition.vsTargetMax || 19.0})" DisplayName="Visual Studio core editor" />
    </Prerequisites>
    <Assets>
        <Asset Type="Microsoft.VisualStudio.ColorTheme" Path="${"name of pkgdef file in package"}" />
    </Assets>
    </PackageManifest>

### manifest.json
this JSON file is defined by the interfaces defined in src/vstheme/maifestjson.ts

### [Content_Types].xml

this part is required per the Open Packaging Conventions. It defines the content-types for every file in the package, usually by defining the default content type for each file extension. for example:
    <?xml version="1.0" encoding="utf-8"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="vsixmanifest" ContentType="text/xml" />
        <Default Extension="pkgdef" ContentType="text/plain" />
        <Default Extension="png" ContentType="application/octet-stream" />
        <Default Extension="json" ContentType="application/json" />
    </Types>

### extension.pkgdef

pkgdef files are defined in the following "pkgdef structure" section

## JSON theme definition file structure

The compile operation uses a json file that defines the theme. This json format is specific to this program.

The json structure is defined by src/vstheme/IThemeDefinition.ts, src/vstheme/ICategoryDefinition.ts, and src/vstheme/IElementDefinition.ts

## XML theme definition file structure

vstheme files are xml files with the following structure (for example)
    <Themes>
        <Theme Name="NameOfTheme" GUID="{1d66dbc2-36cb-433a-8e3f-86dc83293e2e}" BaseGUID="{1ded0138-47ce-435e-84ef-9ec1f439b749}" FallbackId="{1ded0138-47ce-435e-84ef-9ec1f439b749}">
            <Category Name="CategoryName" GUID="{c8887ac6-3c60-4209-9d69-8f4c12a60044}">
                <Color Name="ColorName">
                    <Background Type="CT_RAW" Source="FF3B3B50" />
                    <Foreground Type="CT_RAW" Source="FFFAFAFA" />
                </Color>
            </Category>
        </Theme>
    </Themes>

Each color element has a Type attribute. If the type attribute is "CT_RAW" then Source is the RGB color. If the type attribute is "CT_INVALID" then the Source will be "00000000". CT_INVALID indicates that the color is unset and should have the default value.

Each color element has a Background and a Foreground color.
Color names can have spaces in them

### instructions for writing XML theme files

when reading a theme file or writing a theme file, XML entity names should not be resolved.

## pkgdef structure

pkgdef files are compiled themes from a vsix project. they can be converted back to vstheme with some loss.

They are structured like .reg registry files though they are not strictly merged into the registry

### root structure

[$RootKey$\Themes\{a1b2c3d4-e5f6-7890-abcd-ef1234567890}]
@="Honeypunk"
"Name"="Honeypunk"
"Package"="{a1b2c3d4-e5f6-7890-abcd-ef1234567890}"
"FallbackId"="{1ded0138-47ce-435e-84ef-9ec1f439b749}"

"a1b2c3d4-e5f6-7890-abcd-ef1234567890" is the ID for the theme. this is a GUID
"1ded0138-47ce-435e-84ef-9ec1f439b749" is the ID for the fallback theme. 1ded0138-47ce-435e-84ef-9ec1f439b749 is the "dark" theme
"Honeypunk" is the name for this theme

### category definitions

[$RootKey$\Themes\{a1b2c3d4-e5f6-7890-abcd-ef1234567890}\CodeSense]
"Data"=hex:af,00,00,00,0b,00,00,00,01,00,00,00,9a,96,88,fc,ed,cb,40,49,8f,48,14,2a,50,3e,23,81,05,00,00,00,0d,00,00,00,49,6e,64,69,63,61,74,6f,72,54,65,78,74,00,01,94,a3,b8,ff,14,00,00,00,49,6e,64,69,63,61,74,6f,72,54,65,78,74,48,6f,76,65,72,65,64,00,01,e5,e7,eb,ff,15,00,00,00,49,6e,64,69,63,61,74,6f,72,54,65,78,74,44,69,73,61,62,6c,65,64,00,01,00,d1,ff,66,12,00,00,00,49,6e,64,69,63,61,74,6f,72,53,65,70,61,72,61,74,6f,72,00,01,00,d1,ff,22,15,00,00,00,49,6e,64,69,63,61,74,6f,72,54,65,78,74,53,65,6c,65,63,74,65,64,00,01,00,d1,ff,ff

"a1b2c3d4-e5f6-7890-abcd-ef1234567890" is the ID for the theme. this is a GUID. This is the same ID as defined in the root structure
"CodeSense" is the name of the category
The "Data" key is a binary blob of data that is structure as defined below.

### Data binary blob

All numbers are stored Little Endian.

#### Type definitions for blob structure

-   Int8 : 1 byte representing an 8 bit integer
-   Int16 : 4 bytes representing a 16 bit integer
-   Int32 : 4 bytes representing a 32 bit integer
-   GuidString: 16 bytes representing a GUID . a blob value of 94,89,4a,69,08,92,d6,45,bf,31,c5,8f,96,23,6f,be converts to the GUID {694a8994-9208-45d6-bf31-c58f96236fbe}
-   String: A prefix encoded string
-   ColorToken: 5 bytes representing a color token

#### Prefix encoded strings

This is a sequence of bytes representing an ASCII encoding of a string. The number of bytes will be defined by the first 4 bytes of this defines the number of bytes that will represent the string

#### ColorToken

5 bytes representing a color token:

-   Byte 1: Flag
-   Byte 2: Red component
-   Byte 3: Green component
-   Byte 4: Blue component
-   Byte 5: Alpha channel component

#### blob structure

LengthOfBlob: Int32 - this is the total length of the binary blob, not including LengthOfBlob
Constant1: Int32 - constant value, always 0x11
Constant2: Int32 - constant value, always 0x01
CategoryID: GuidString - the CategoryID as a GUID
SectionDefinitionCount: Int32 - the number of section definitions following

There will now be SectionDefinitionCount SectionDefinitions

##### SectionDefinition structure

SectionName: String - this is the name of the section
SectionData1: ColorToken - this is the first color value
SectionData2: ColorToken - this is the second color value

"1d66dbc2-36cb-433a-8e3f-86dc83293e2e"

## Sample vstheme files

Here are sample vstheme files

-   ./Samples/Sample1.vstheme
-   ./Samples/Sample2.vstheme

## Sample pkgdef files

Here are sample pkgdef files from a vsix

-   ./Samples/sampleTheme.pkgdef

## Sample json theme definitions

Here are sample json theme definitions:

    ./Samples/sampleTheme.json
    
