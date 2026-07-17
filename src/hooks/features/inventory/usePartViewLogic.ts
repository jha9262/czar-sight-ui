import { usePart, usePartVersions, usePartVariants } from "@/lib/queries";

export function usePartViewLogic(id: string) {
  const { data: part, isLoading: isPartLoading } = usePart(id);
  const { data: versions = [], isLoading: isVersionsLoading } = usePartVersions();
  const { data: variants = [], isLoading: isVariantsLoading } = usePartVariants();

  const partVersions = versions.filter((v) => v.partMasterId === id);
  const versionIds = partVersions.map((v) => v.id);
  const partVariants = variants.filter((v) => versionIds.includes(v.partVersionId));

  return {
    state: {
      part,
      partVersions,
      partVariants,
      isLoading: isPartLoading || isVersionsLoading || isVariantsLoading,
    },
  };
}
