
import { Guid } from "../util/Guid";
import { IThemeDefinition } from "./IThemeDefinition";

export class Builtins
{
    private static readonly builtinNameMap: Map<string, Guid> = new Map([
        ["builtin:Dark", new Guid("1ded0138-47ce-435e-84ef-9ec1f439b749")],
        ["builtin:ShellInternal", new Guid("5af241b7-5627-4d12-bfb1-2b67d11127d7")],
        ["builtin:Shell", new Guid("73708ded-2d56-4aad-b8eb-73b20d3f4bff")],
        ["builtin:CommonControls", new Guid("{c01072a1-a915-4abf-89b7-e2f9e8ec4c7f}")],
        ["builtin:CommonDocument", new Guid("{72eb4027-f4ae-4b6c-9cc2-dfd5b49d9415}")],
        ["builtin:CommonDocumentCard", new Guid("{2e129498-0d2d-43ca-94d6-c652c0132543}")],
        ["builtin:Environment", new Guid("{624ed9c3-bdfd-41fa-96c3-7c824ea32e3d}")],
        ["builtin:Find", new Guid("{4370282e-987e-4ac4-ad14-5ffed2ad1e14}")],
        ["builtin:Find Results", new Guid("{5c48b2cb-0366-4fbf-9786-0bb37e945687}")],
        ["builtin:ACDCOverview", new Guid("{c8887ac6-3c60-4209-9d69-8f4c12a60044}")],
        ["builtin:AI", new Guid("{7730ec54-ee62-4fd2-86cc-77071aabb206}")],
        ["builtin:ApplicationInsights", new Guid("{fb17cf37-09ea-44a4-88a6-cd806fc6a24a}")],
        ["builtin:Autos", new Guid("{a7ee6bee-d0aa-4b2f-ad9d-748276a725f6}")],
        ["builtin:Chat", new Guid("{9e237087-2ccf-49c1-8c85-974b201581e3}")],
        ["builtin:Cider", new Guid("{92d153ee-57d7-431f-a739-0931ca3f7f70}")],
        ["builtin:ClientDiagnosticsMemory", new Guid("{4ec0c2e0-c165-47be-9f29-2d2b73ad3e93}")],
        ["builtin:ClientDiagnosticsTimeline", new Guid("{694a8994-9208-45d6-bf31-c58f96236fbe}")],
        ["builtin:ClientDiagnosticsTools", new Guid("{9e505e47-0d0d-4681-8c9c-baa2a07771b7}")],
        ["builtin:CodeAnalysis", new Guid("{bbadd5c0-3c00-4c56-aae8-92cd1d1f516b}")],
        ["builtin:CodeSenseControls", new Guid("{de7b1121-99a4-4708-aedf-15f40c9b332f}")],
        ["builtin:Command Window", new Guid("{ee1be240-4e81-4beb-8eea-54322b6b1bf5}")],
        ["builtin:CosmosClientTools.2.3.4000.1", new Guid("{6f796f8a-b3b5-49eb-9b25-cb59bd413caf}")],
        ["builtin:CpuUsageTool", new Guid("{02071ec8-0cf0-4822-af30-9f001537e7eb}")],
        ["builtin:DataGrid", new Guid("{925b1226-26e5-47e0-9d0d-673301e557fb}")],
        ["builtin:Decorative", new Guid("{0c37665d-8581-4451-8394-6f4d5abd88b1}")],
        ["builtin:DetailsView", new Guid("{a128c60e-947c-4f26-95c9-fb4b3d53547f}")],
        ["builtin:Diagnostics", new Guid("{6f4c1845-5111-4f31-b204-47cb6a466ee8}")],
        ["builtin:DiagnosticsHub", new Guid("{f8a8b2a5-dd35-43f6-a382-fd6a61325c22}")],
        ["builtin:EditorOverride", new Guid("{656339d7-0e39-43e2-98aa-becc3f87ffa5}")],
        ["builtin:Folder Difference", new Guid("{b36b0228-dbad-4db0-b9c7-2ad3e572010f}")],
        ["builtin:FSharpInteractive", new Guid("{00ccee86-3140-4e06-a65a-a92665a40d6f}")],
        ["builtin:GraphDocumentColors", new Guid("{0cd5aa2b-ef23-4997-80b5-7d0e8fe5b312}")],
        ["builtin:GraphicsDebugger", new Guid("{40cdc500-10ac-41df-a533-6af2aaaa0c4b}")],
        ["builtin:GraphicsDesigners", new Guid("{9cfdb8b3-48aa-4715-ac38-dde2968d204f}")],
        ["builtin:Header", new Guid("{4997f547-1379-456e-b985-2f413cdfa536}")],
        ["builtin:Immediate Window", new Guid("{6bb65c5a-2f31-4bde-9f48-8a38dc0c63e7}")],
        ["builtin:InfoBar", new Guid("{832df9d1-d9a9-4eb7-ad13-ff5b421f7432}")],
        ["builtin:InformationBadge", new Guid("{63f9718c-889b-4814-a3b4-6e81d14f1156}")],
        ["builtin:IntelliTrace", new Guid("{ffa74b06-e011-49be-a58c-3efaa4b957d5}")],
        ["builtin:InvariantTabbedDesigner", new Guid("{cbe82e17-dab9-4324-bb17-c601706ef2ef}")],
        ["builtin:JetBrains Platform", new Guid("{57ebc645-c59e-42db-80b5-87917407d8a0}")],
        ["builtin:ListViewGrid", new Guid("{63dec435-18e1-4e62-a9a9-0495fcb524a3}")],
        ["builtin:Locals", new Guid("{8259aced-490a-41b3-a0fb-64c842ccdc80}")],
        ["builtin:Logcat", new Guid("{1d30081b-8d57-4391-bba5-4168aa50ba6d}")],
        ["builtin:ManifestDesigner", new Guid("{b239f458-9f75-4376-959b-4d48b89337f4}")],
        ["builtin:NavigateTo", new Guid("{d58e4793-9fe6-450b-b200-b93a3c17aa12}")],
        ["builtin:NewProjectDialog", new Guid("{c36c426e-31c9-4048-84cf-31c111d65ec0}")],
        ["builtin:NotificationBubble", new Guid("{800c5171-6625-4a74-b3e2-a6cd0b4698d4}")],
        ["builtin:Output Window", new Guid("{9973efdf-317d-431c-8bc1-5e88cbfd4f7f}")],
        ["builtin:Package Manager Console", new Guid("{f9d6bce6-c669-41db-8ee7-dd953828685b}")],
        ["builtin:PackageManifestEditor", new Guid("{3f27d653-86e6-4a04-adb6-a35efa6c8f05}")],
        ["builtin:Performance Tips", new Guid("{7a4c6cc9-8404-4b95-af88-f11b657c7268}")],
        ["builtin:ProgressBar", new Guid("{94acf70f-a81d-4512-a31d-8196616751ee}")],
        ["builtin:ProjectDesigner", new Guid("{ef1a2d2c-5d16-4ddb-8d04-79d0f6c1c56e}")],
        ["builtin:Promotion", new Guid("{8fafb063-4106-4756-81dc-d7769f24d056}")],
        ["builtin:ReSharper", new Guid("{b7f08e34-ad23-4855-9daf-f1cf808a7c72}")],
        ["builtin:SearchControl", new Guid("{f1095fad-881f-45f1-8580-589e10325eb8}")],
        ["builtin:SharePointTools", new Guid("{7e8da76d-24b4-447c-8ece-ff8e0e73f0d4}")],
        ["builtin:SqlResultsGrid", new Guid("{6202ff3e-488e-4ead-92cb-be089659f8d7}")],
        ["builtin:SqlResultsText", new Guid("{587d0421-e473-4032-b214-9359f3b7bc80}")],
        ["builtin:StartPage", new Guid("{65d78f35-869e-4bf3-8e52-991fee554a16}")],
        ["builtin:TabbedDesigner", new Guid("{35e33be4-027b-40b5-83a3-c10540994010}")],
        ["builtin:Task Runner Explorer", new Guid("{af57483a-a3e2-4330-a7cd-21f3dc681594}")],
        ["builtin:TaskRunnerExplorerControls", new Guid("{abb9394c-8c5a-447e-b1b7-965e0b6abbc3}")],
        ["builtin:TeamExplorer", new Guid("{4aff231b-f28a-44f0-a66b-1beeb17cb920}")],
        ["builtin:Text Editor Language Service Items", new Guid("{e0187991-b458-4f7e-8ca9-42c9a573b56c}")],
        ["builtin:Text Editor MEF Items", new Guid("{75a05685-00a8-4ded-bae5-e7a50bfa929a}")],
        ["builtin:Text Editor Text Manager Items", new Guid("{58e96763-1d3b-4e05-b6ba-ff7115fd0b7b}")],
        ["builtin:Text Editor Text Marker Items", new Guid("{ff349800-ea43-46c1-8c98-878e78f46501}")],
        ["builtin:ThemedAcceleratedDialog", new Guid("{a2859846-e4aa-452d-ac41-8cc0e4e72e4c}")],
        ["builtin:ThemedDialog", new Guid("{5e04b2a9-e443-48db-8791-63a2a71cfbd7}")],
        ["builtin:ThemedUtilityDialog", new Guid("{e2961a72-48a5-4da7-8168-1fee490f78a7}")],
        ["builtin:ToolTips", new Guid("{a9a5637f-b2a8-422e-8fb5-dfb4625f0111}")],
        ["builtin:TreeView", new Guid("{92ecf08e-8b13-4cf4-99e9-ae2692382185}")],
        ["builtin:UnthemedDialog", new Guid("{d1fae935-144d-45a6-af9a-d615e3cd7b75}")],
        ["builtin:UserInformation", new Guid("{b6d9f1fc-e422-4755-a014-3fb666d831dc}")],
        ["builtin:UserNotifications", new Guid("{5d42b198-efca-431c-92aa-8b595d0d39c2}")],
        ["builtin:VersionControl", new Guid("{6be84f44-74e4-4e5f-aee9-1b930f431375}")],
        ["builtin:VisualProfiler", new Guid("{cf3994af-130f-4f0d-a84e-3601e4e357d9}")],
        ["builtin:VisualStudioInstaller", new Guid("{53212856-7528-403d-84e6-76820f4cef73}")],
        ["builtin:VsGraphics", new Guid("{1b5630dd-453f-45e0-94f0-7413c05fff83}")],
        ["builtin:VSSearch", new Guid("{04ba5a31-6d4d-4225-9194-2e38a9175e31}")],
        ["builtin:Watch", new Guid("{358463d0-d084-400f-997e-a34fc570bc72}")],
        ["builtin:WebClient Diagnostic Tools", new Guid("{2aa714ae-53be-4393-84e0-dc95b57a1891}")],
        ["builtin:WorkflowDesigner", new Guid("{e0f1945b-b965-47dc-b22e-3e26a895c895}")],
        ["builtin:WorkItemEditor", new Guid("{2138d120-456d-425e-80b5-88d2401fca23}")],
        ["builtin:XamarinDesigner", new Guid("{78d640b7-154a-4d1e-bbe8-fee14b3ccf29}")],
        ["builtin:CodeSense", new Guid("{fc88969a-cbed-4940-8f48-142a503e2381}")],
        ["builtin:ConfigPage", new Guid("{699a73b3-57e2-4754-9364-ee80d6852c2f}")],
        ["builtin:Editor Tooltip", new Guid("{a1b2c3d4-e5f6-7890-abcd-ef1234567890}")],
        ["builtin:WelcomeExperience", new Guid("{df76799d-28de-4975-81af-3357270f57eb}")]
    ]);

    static ReduceGuidToBuiltinName(guid: Guid): string | null
    {
        for (const [name, builtinGuid] of this.builtinNameMap.entries())
        {
            if (guid.ToString().toLowerCase() === builtinGuid.ToString().toLowerCase())
                return name;
        }
        return null;
    }

    static ExpandOrThrow(builtinName: string): Guid
    {
        if (builtinName.startsWith("builtin:"))
        {
            const guid = this.builtinNameMap.get(builtinName);

            if (!guid)
                throw new Error(`unknown builtin theme name: ${builtinName}`);

            return guid;
        }

        return new Guid(builtinName);
    }
    static ExpandBuiltinNames(themeDef: IThemeDefinition): void
    {
        themeDef.guid = this.ExpandOrThrow(themeDef.guid as string);
        themeDef.fallback = this.ExpandOrThrow(themeDef.fallback as string);

        for (const category of themeDef.categoryDefinitions)
        {
            if (category.category.startsWith("builtin:"))
            {
                category.guid = this.ExpandOrThrow(category.category);
                category.category = category.category.substring("builtin:".length);
            }
            else
            {
                if (!category.guid)
                    throw new Error(`Category "${category.category}" is missing a GUID in theme "${themeDef.name}".`);

                category.guid = new Guid(category.guid as string);
            }
        }
    }

    static RunUnitTests(): void
    {
        // verify that all built-in names map to unique GUIDs
        const seenGuids = new Set<string>();
        for (const [name, guid] of this.builtinNameMap.entries())
        {
            const guidStr = guid.ToString().toLowerCase();
            if (seenGuids.has(guidStr))
                throw new Error(`Duplicate GUID found in Builtins for name: ${name} GUID: ${guidStr}`);
            seenGuids.add(guidStr);
        }
    }
}