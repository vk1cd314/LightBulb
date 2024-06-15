import HeaderCard from "../components/Shared/HeaderCard";

const CommunityPage = () => {
    return (
        <>
            <h1 className="text-3xl font-bold text-center mt-20">Mathematics Kernel Community</h1>
            <div className="flex flex-col items-center mt-10 space-y-3">
                <HeaderCard />
                <HeaderCard />
                <HeaderCard />
            </div>
        </>
    );
};

export default CommunityPage;