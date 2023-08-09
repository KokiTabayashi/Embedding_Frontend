export const AlertSuccess = ({ success }) => {
    if (success === '') {
        return <></>;
    }

    return <p className='success'>{success}</p>;
};